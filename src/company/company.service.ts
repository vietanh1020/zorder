import { Company } from '@/database/entities';
import { RoleType } from '@/types';
import { isOwner } from '@/untils';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyDto } from './dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: EntityRepository<Company>,
    private entityManager: EntityManager,
  ) {}

  async updateCompany(id: string, role: RoleType, data: CompanyDto) {
    if (!isOwner(role)) throw new ForbiddenException();

    const company = await this.companyRepository.findOne({ id });
    if (!company) throw new NotFoundException('Company not found');

    this.companyRepository.assign(company, data);
    await this.companyRepository.persistAndFlush(company);

    return company;
  }

  async getCompany(id: string) {
    return await this.companyRepository.findOne({ id });
  }
}
