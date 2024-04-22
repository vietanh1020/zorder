import { Bill } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepo: EntityRepository<Bill>,
  ) {}

  async findAll(companyId: string) {
    return await this.billRepo.find({ companyId });
  }

  async findOne(id: string) {
    return await this.billRepo.find({ id });
  }
}
