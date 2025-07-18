import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from 'dto/payment-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('createPaymentsSession')
  createPaymentsSession(@Body() body: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(body);
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
