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

  async sendNotify(companyId: string): Promise<void> {
    const firebaseAdmin = this.getFirebaseAdmin();

    try {
      const users = await this.deviceRepo.find({
        companyId,
      });

      for (let user of users) {
        const msg: any = {
          notification: {
            title: 'Zorder',
            body: 'You have new Order',
          },
          token: user.token,
        };
        await firebaseAdmin.messaging().send(msg);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
