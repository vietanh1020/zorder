import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const accessToken = req.cookies['access_token'] || '';

    try {
      req.user = this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_ACCESS_KEY'),
      });
      console.log(req.user);
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
