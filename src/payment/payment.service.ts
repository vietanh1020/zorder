import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Card } from 'src/schemas/Card.schema';
import { Company } from 'src/schemas/Company.schema';
import { Invoice } from 'src/schemas/Invoice.schema';
import { UserTracking } from 'src/schemas/UserTracking.schema';
import { ServerException } from 'src/share/exceptions/server.exception';
import { InvoiceDto } from './dtos/payment.dto';
import { StripeService } from './stripe.service';
import { Config } from 'src/schemas/Config.schema';
import { CardService } from './card.service';

@Injectable()
export class PaymentService {
  constructor(
    private stripeService: StripeService,
    @InjectModel(Card.name)
    private cardModel: Model<Card>,

    @InjectModel(Company.name)
    private companyModel: Model<Company>,

    @InjectModel(UserTracking.name)
    private userTrackingModel: Model<UserTracking>,

    @InjectModel(Config.name)
    private configModel: Model<Config>,

    @InjectModel(Invoice.name)
    private invoiceModel: Model<Invoice>,

    private config: ConfigService,
    private cardService: CardService,
  ) {}

  async getInvoices(company: string) {
    return await this.invoiceModel.find({
      company,
    });
  }

  async updateReceipt(id: string) {
    const result = await this.invoiceModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { status: 'Success' } },
        { useFindAndModify: false },
      )
      .exec();
    if (result) {
      const message = 'Payment successfully!';
      return message;
    } else {
      throw new BadRequestException();
    }
  }

  async countReport(company: string, fromTime: string, toTime: string) {
    return await this.userTrackingModel
      .countDocuments({ company, date: { $gte: fromTime, $lte: toTime } })
      .exec();
  }

  async createInvoice(invoice: InvoiceDto) {
    const { status, company } = invoice;
    if (status === 'Failed') await this.blockAppDesktop(company);
    return await this.invoiceModel.create(invoice);
  }

  async jobCreateInvoice() {
    const prevMonth = moment().subtract(1, 'months');
    const fromDate = prevMonth.startOf('month').format('YYYY-MM-DD');
    const toDate = prevMonth.endOf('month').format('YYYY-MM-DD');

    const companies = await this.companyModel.find();

    const receipts = await Promise.all(
      companies.map(async (company: Company) => {
        const total = await this.countReport(company._id, fromDate, toDate);
        const amount = total * 0.5;
        return { company: company._id, total, amount };
      }),
    );

    Promise.all(
      receipts.map(async (item) => {
        const { company, total, amount } = item;
        if (amount >= 0.5) {
          const card = await this.cardModel.findOne({ company });

          const lastInvoice = await this.invoiceModel.findOne({
            company,
            from_date: fromDate,
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

  async manualCharge(_id: string) {
    const invoice = await this.invoiceModel.findOne({ _id });
    if (!invoice || invoice.status === 'Success')
      throw new BadRequestException('Invoice not found');

    const card = await this.cardModel.findOne({ company: invoice.company });
    if (!card)
      throw new BadRequestException(
        'Card not found! Please check card information',
      );

    try {
      const result = await this.stripeService.autoCharge(
        card.metadata.id,
        card.metadata.customer,
        invoice.total,
      );
      if (result.status === 'succeeded') {
        await this.enableAppDesktop(invoice.company);
        return await this.updateReceipt(_id);
      } else throw new ServerException('Charge failed');
    } catch (error) {
      throw new ServerException('Charge failed');
    }
  }

  async blockAppDesktop(company: string) {
    return await this.configModel.findOneAndUpdate(
      { company },
      { $set: { is_block: true } },
      { useFindAndModify: false },
    );
  }

  async enableAppDesktop(company: string) {
    return await this.configModel.findOneAndUpdate(
      { company },
      { $set: { is_block: false } },
      { useFindAndModify: false },
    );
  }

  async blockCompanyTrial() {
    const date = moment().subtract(14, 'days').toDate();
    const companies = await this.companyModel.find({
      create_at: { $lt: date },
      start_pay: null,
    });

    const blocks = companies.map(async ({ _id }: Company) => {
      return await this.blockAppDesktop(_id);
    });

    Promise.all(blocks);

    return companies;
  }

  async upgradePayVersion(company: string) {
    const card = await this.cardService.getCardCompany(company);
    if (!card) throw new BadRequestException('Please add card');

    try {
      await this.enableAppDesktop(company);
      return await this.companyModel.findOneAndUpdate(
        { company, start_pay: null },
        { $set: { start_pay: new Date() } },
        { useFindAndModify: false },
      );
    } catch (error) {
      console.log('Error upgradePayVersion: ', error);
    }
  }
}
