import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private config: ConfigService) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(companyId: string) {
    return this.stripe.customers.create({ name: companyId });
  }

  async getCustomer(email: string) {
    const result = await this.stripe.customers.search({
      query: `name:"${email}"`,
    });

    if (!result.data.length) {
      return this.createCustomer(email);
    }

    return result.data[0];
  }

  async addMetadata(paymentMethodId: string, email: string) {
    const customer = await this.getCustomer(email);

    const attachedCard = await this.stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer: customer.id,
      },
    );

    return attachedCard;
  }

  async detachCard(stripePmId: string) {
    await this.stripe.paymentMethods.detach(stripePmId);
  }

  async autoCharge(
    stripeCardId: string,
    stripeCustomerId: string,
    amount: number,
    currency = 'USD',
  ) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      customer: stripeCustomerId,
      payment_method: stripeCardId,
      confirm: true,
    });
  }

  async refunds(paymentIntent: string, amount: number) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntent,
      amount,
    });
  }
}
