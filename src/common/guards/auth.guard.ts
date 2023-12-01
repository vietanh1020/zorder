import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const accessToken = req.cookies['token'] || '';

    try {
      req.user = this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_ACCESS_KEY'),
      });
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
