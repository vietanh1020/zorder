import { User } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
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

    return users.map((user) => {
      const { password, ...other } = user;
      return other;
    });
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      id: userId,
    });

    if (!user) throw new BadRequestException(['User not existed']);

    delete user.password;
    return user;
  }

  async removeStaff(userId: string, companyId: string) {
    const user = await this.usersRepository.findOne({
      id: userId,
      companyId,
    });

    if (!user) throw new BadRequestException(['Staff not existed']);

    if (user?.role === 'owner')
      throw new BadRequestException(['Owner can not be deleted']);

    await this.usersRepository.removeAndFlush(user);

    return user.id;
  }
}
