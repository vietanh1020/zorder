import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

const serviceAccount = require('../../serviceAccount.json');

@Injectable()
export class NotificationService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  getFirebaseAdmin(): admin.app.App {
    return this.firebaseAdmin;
  }

  async sendNotify(deviceToken: string, message: string): Promise<void> {
    const firebaseAdmin = this.getFirebaseAdmin();

    const msg: any = {
      notification: {
        title: 'Notification Title',
        body: message,
      },
      token: deviceToken,
    };

    try {
      await firebaseAdmin.messaging().send(msg);
      return msg;
    } catch (error) {
      console.error(error);
    }
  }
}
