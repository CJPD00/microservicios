/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { OrderStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { OrderStatusList } from 'src/orders/enum/order.enum';

export class StatusDto {
  @IsEnum(OrderStatus, {
    message: `Status must be one of ${OrderStatusList}`,
  })
  status: OrderStatus;
}
