import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Company, User } from '@/database/entities';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: EntityRepository<Company>,
    private entityManager: EntityManager,
  ) {}

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async checkUserNotExist(email: string) {
    const existedUser: User = await this.usersRepository.findOne({
      email,
    });

    if (existedUser) throw new BadRequestException('Email already existed');

    return true;
  }

  async createAdmin(adminDto: CreateAdminDto) {
    const { company, ...user } = adminDto;

    await this.checkUserNotExist(user.email);

    const createCompany = this.companyRepository.create(company);
    await this.companyRepository.persistAndFlush(createCompany);

    const createUser = this.usersRepository.create({
      ...user,
      role: 'admin',
      companyId: createCompany.id,
    });
    await this.usersRepository.persistAndFlush(createUser);

    return {
      ...createUser,
      company: createCompany,
    };
  }
}
