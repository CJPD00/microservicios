import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('createPaymentsSession')
  createPaymentsSession() {
    return 'createPaymentsSession';
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
