import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from 'dto/payment-session.dto';
import { Request, Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('createPaymentsSession')
  @MessagePattern('create.payment.session')
  createPaymentsSession(@Payload() data: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(data);
  }

  @Get('success')
  acceptPayment() {
    return {
      ok: true,
      message: 'acceptPayment',
    };
  }

  @Get('cancel')
  cancelPayment() {
    return {
      ok: false,
      message: 'cancelPayment',
    };
  }

  @Post('webhook')
  webhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);
  }

  @Get('webhook')
  webhookGet() {
    return {
      ok: true,
      message: 'webhook',
    };
  }
}
