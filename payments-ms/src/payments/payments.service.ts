/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { envs } from 'config/envs';
import { PaymentSessionDto } from 'dto/payment-session.dto';
import { Request, Response } from 'express';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(data: PaymentSessionDto) {
    const { currency, items } = data;
    const lineItems = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {},
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }

  stripeWebhook(req: Request, res: Response) {
    if (req.headers['stripe-signature'] === undefined) {
      console.log('Missing Stripe Signature');
      return res.status(400).send('Missing Stripe Signature');
    }

    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;
    let rawBody = '';

    req.on('data', (chunk) => (rawBody += chunk));

    req.on('end', () => {
      try {
        event = this.stripe.webhooks.constructEvent(
          rawBody,
          sig,
          envs.signingSecret,
        );
        console.log(event);
        switch (event.type) {
          case 'charge.succeeded':
            console.log('Charge succeeded');
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } catch (error) {
        console.log(`Webhook Error: ${error}`);
        return res.status(400).send(`Webhook Error: ${error}`);
      }
    });

    return res.status(200).json({ received: true, signature: sig });
  }
}
