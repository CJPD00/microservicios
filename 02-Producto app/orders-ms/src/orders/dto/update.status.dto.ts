/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';

export class UpdateStatusDto {
  @IsUUID()
  id: string;

  @IsEnum(OrderStatus, {
    message: `Status must be one of ${OrderStatusList}`,
  })
  status: OrderStatus;
}
