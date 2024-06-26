import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';
import appConfig from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { CronjobModule } from './cronjob/cronjob.module';
import { CategoryModule } from './category/category.module';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'vak63.uet.vnu@gmail.com',
          pass: 'bevl oxoh fxyj fqwq',
        },
      },
    }),

    MikroOrmModule.forRoot(),
    MenuModule,
    AuthModule,
    OrderModule,
    CompanyModule,
    PaymentModule,
    UserModule,
    CategoryModule,
    CronjobModule,
    BillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
