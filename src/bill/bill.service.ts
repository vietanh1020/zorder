import { Bill, OrderDetail } from '@/database/entities';
import { FailedStatus } from '@/untils';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepo: EntityRepository<Bill>,

    @InjectRepository(OrderDetail)
    private readonly detailRepo: EntityRepository<OrderDetail>,
  ) {}

  async findAll(companyId: string) {
    const bills = await this.billRepo.find(
      { companyId },
      { orderBy: { createdAt: 'DESC' } },
    );

    const data = bills.map(async (bill) => {
      return { ...bill };

      // , detail: await this.findOne(bill.id)
    });

    return Promise.all(data);
  }

  async findOne(id: string) {
    const orderInBill = await this.billRepo.findOne({ id });

    if (!orderInBill) throw new NotFoundException('Bill not found');

    const idArr = orderInBill.orderIds;

    const detail = await this.detailRepo.find({ orderId: { $in: idArr } });

    const foods = detail.filter((item) => !FailedStatus.includes(item.status));

    return { ...orderInBill, detail: foods.sort() };
  }
}
