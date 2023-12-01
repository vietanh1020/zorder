import { User } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}

  async getUser(companyId: string) {
    const users = await this.usersRepository.find({
      companyId,
    });

    return users.map((user) => delete user.password);
  }
}
