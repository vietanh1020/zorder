import { Company } from '@/database/entities';
import { RoleType } from '@/types';
import { isOwner } from '@/untils';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyDto } from './dto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

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

  async getTableStatus(companyId: string) {
    try {
      const table: string | undefined = await this.cacheManager.get(
        `Table_${companyId}`,
      );
      const res = table ? JSON.parse(table) : [];
      return res.map((t: string) => +t);
    } catch (error) {
      return [];
    }

    // return await this.cacheManager.get(`Table_${companyId}`);
  }
}
