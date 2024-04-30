import { Company, Order } from '@/database/entities';
import { Invoice } from '@/database/entities/invoice.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { CardService } from './card.service';
import { InvoiceDto } from './dto/create-payment.dto';
import { StripeService } from './stripe.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PaymentService {
  constructor(
    private stripeService: StripeService,

    private cardService: CardService,

    @InjectRepository(Company)
    private readonly companyRepo: EntityRepository<Company>,

    @InjectRepository(Invoice)
    private readonly invoiceRepo: EntityRepository<Invoice>,

    @InjectRepository(Order)
    private readonly orderRepo: EntityRepository<Order>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    private entityManager: EntityManager,
  ) {}

  async getInvoices(company: string) {
    return await this.invoiceRepo.find({
      companyId: company,
    });
  }

  async updateReceipt(id: string) {
    const receipt = await this.invoiceRepo.findOne(id);

    if (!receipt) throw new NotFoundException();

    const newReceipt = this.invoiceRepo.assign(receipt, { status: 'Success' });

    await this.invoiceRepo.persistAndFlush(newReceipt);
    return receipt;
  }

  async countReport(company: string, fromTime: string, toTime: string) {
    return await this.orderRepo.count({
      companyId: company,
      createdAt: { $gte: fromTime, $lte: toTime },
    });
  }

  async createInvoice(invoice: InvoiceDto) {
    const { status, company } = invoice;
    if (status === 'Failed') await this.blockCompany(company);
    const data = this.invoiceRepo.create(invoice);
    await this.invoiceRepo.persistAndFlush(data);
  }

  async jobCreateInvoice() {
    const prevMonth = moment().subtract(1, 'months');
    const fromDate = prevMonth.startOf('month').format('YYYY-MM-DD');
    const toDate = prevMonth.endOf('month').format('YYYY-MM-DD');
    const pricing = 0.1; // 0.05$/request order

    const companies = await this.companyRepo.findAll();

    const receipts = await Promise.all(
      companies.map(async (company: Company) => {
        const total = await this.countReport(company.id, fromDate, toDate);
        const amount = total * pricing;
        return { company: company.id, total, amount };
      }),
    );

    Promise.all(
      receipts.map(async (item) => {
        const { company, total, amount } = item;
        if (amount >= 0.5) {
          const card = await this.cardService.getCardDefault(company);

          const lastInvoice = await this.invoiceRepo.findOne({
            companyId: company,
            fromDate,
          });

          const invoice: InvoiceDto = {
            company,
            status: 'Failed',
            fromDate,
            toDate,
            total: amount,
            info: total,
            cardNumber: card?.metadata?.card?.last4,
          };

          if (lastInvoice) return;

          if (!card) return await this.createInvoice(invoice);

          try {
            const result = await this.stripeService.autoCharge(
              card.metadata.id,
              card.metadata.customer,
              amount,
            );
            if (result.status === 'succeeded') {
              return await this.createInvoice({
                ...invoice,
                status: 'Success',
              });
            } else {
              return await this.createInvoice(invoice);
            }
          } catch (error) {
            console.log({ error });
            return await this.createInvoice(invoice);
          }
        }
      }),
    );

    return receipts;
  }

  async manualCharge(id: string) {
    const invoice = await this.invoiceRepo.findOne({ id });
    if (!invoice || invoice.status === 'Success')
      throw new BadRequestException('Invoice not found');

    const card = await this.cardService.getCardDefault(invoice.companyId);
    if (!card)
      throw new BadRequestException(
        'Card default not found! Please check card information',
      );

    try {
      const result = await this.stripeService.autoCharge(
        card.metadata.id,
        card.metadata.customer,
        invoice.amount,
      );
      if (result.status === 'succeeded') {
        await this.enableCompany(invoice.companyId);
        return await this.updateReceipt(id);
      } else throw new InternalServerErrorException('Charge failed');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Charge failed');
    }
  }

  async blockCompany(id: string) {
    this.cacheManager.set(`blocked:${id}`, true);
  }

  async enableCompany(id: string) {
    this.cacheManager.del(`blocked:${id}`);
  }

  async blockTrial() {
    const date = moment().subtract(14, 'days').toDate();
    const companies = await this.companyRepo.find({
      createdAt: { $lt: date },
    });

    const blocks = companies.map(async ({ id }: Company) => {
      return await this.blockCompany(id);
    });

    Promise.all(blocks);

    return companies;
  }

  async upgradePayVersion(company: string) {
    const card = await this.cardService.getCardDefault(company);
    if (!card) throw new BadRequestException('Please add card');

    try {
      await this.enableCompany(company);
      // return await this.companyRepo.findOneAndUpdate();
    } catch (error) {
      console.log('Error upgradePayVersion: ', error);
    }
  }
}
