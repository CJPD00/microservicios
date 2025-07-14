import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from 'dto/payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('createPaymentsSession')
  createPaymentsSession(@Body() body: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(body);
  }

  @Get('acceptPayment')
  acceptPayment() {
    return {
      ok: true,
      message: 'acceptPayment',
    };
  }

  @Get('cancelPayment')
  cancelPayment() {
    return {
      ok: false,
      message: 'cancelPayment',
    };
  }

  @Post('webhook')
  webhook() {
    return {
      ok: true,
      message: 'webhook',
    };
  }
}
