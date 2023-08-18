import { Company, User } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto, LoginDto } from './dto';
import { JwtDecoded, TokenType } from '@/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async generateToken(data: JwtDecoded, type: TokenType) {
    let expiresIn = '1h';
    let secret = this.configService.get('JWT_ACCESS_KEY');

    if (type === 'refreshToken') {
      expiresIn = '30d';
      secret = this.configService.get('JWT_REFRESH_KEY');
    }

    return this.jwtService.signAsync(data, {
      secret,
      expiresIn,
    });
  }

  async loginCredentials(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
      email,
    });

    const validPassword = await bcrypt.compare(password, user?.password || '');

    if (!user || !validPassword)
      throw new BadRequestException('Email hoặc mật khẩu không đúng!');

    const data: JwtDecoded = {
      id: user.id,
      company_id: user.companyId,
      role: user.role,
    };

    const accessToken = await this.generateToken(data, 'accessToken');
    const refreshToken = await this.generateToken(data, 'refreshToken');

    delete user.password;

    return {
      ...user,
      accessToken,
      refreshToken,
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

    // Create company
    const createCompany = this.companyRepository.create(company);
    await this.companyRepository.persistAndFlush(createCompany);

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(user.password, salt);

    // Create user
    const createUser = this.usersRepository.create({
      ...user,
      role: 'admin',
      password: hashed,
      companyId: createCompany.id,
    });
    await this.usersRepository.persistAndFlush(createUser);

    const tokenData = {
      id: createUser.id,
      company_id: createUser.companyId,
      role: createUser.role,
    };

    const accessToken = await this.generateToken(tokenData, 'accessToken');
    const refreshToken = await this.generateToken(tokenData, 'refreshToken');

    delete createUser.password;

    return {
      ...createUser,
      company: createCompany,
      accessToken,
      refreshToken,
    };
  }
}
