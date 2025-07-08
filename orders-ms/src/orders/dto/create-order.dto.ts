/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
//import { OrderStatus } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  // IsBoolean,
  // IsEnum,
  // IsNumber,
  // IsOptional,
  // IsPositive,
  ValidateNested,
} from 'class-validator';
//import { OrderStatusList } from '../enum/order.enum';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  // @IsNumber()
  // @IsPositive()
  // totalAmount: number;

  // @IsNumber()
  // @IsPositive()
  // totalItems: number;

  // @IsEnum(OrderStatusList, {
  //   message: `Status must be one of ${OrderStatusList}`,
  // })
  // @IsOptional()
  // status: OrderStatus = OrderStatus.PENDING;

  // @IsOptional()
  // @IsBoolean()
  // paid: boolean = false;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({each:true})
  @Type(() => OrderItemDto)
   items: OrderItemDto[];

}
