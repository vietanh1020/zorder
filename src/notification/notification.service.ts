import { Device } from '@/database/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

const serviceAccount = require('../../serviceAccount.json');

@Injectable()
export class NotificationService {
  private readonly firebaseAdmin: admin.app.App;

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: EntityRepository<Device>,
  ) {
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  getFirebaseAdmin(): admin.app.App {
    return this.firebaseAdmin;
  }

  async sendNotify(
    companyId: string,
    body = 'Bạn có 1 đơn hàng mới',
  ): Promise<void> {
    const firebaseAdmin = this.getFirebaseAdmin();

    try {
      const users = await this.deviceRepo.find({
        companyId,
      });

      for (let user of users) {
        const msg: any = {
          notification: {
            title: 'Zorder',
            body,
          },
          token: user.token,
        };
        await firebaseAdmin.messaging().send(msg);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async sendNotiCustomer(token: string): Promise<void> {
    const firebaseAdmin = this.getFirebaseAdmin();

    try {
      const msg: any = {
        notification: {
          title: 'Zorder',
          body: 'Có cập nhật mới cho đơn của bạn',
        },
        token: token,
      };
      await firebaseAdmin.messaging().send(msg);
    } catch (error) {
      console.error(error);
    }
  }
}
