/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { OrderStatusList } from '../enum/order.enum';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Status must be one of ${OrderStatusList}`,
  })
  status?: OrderStatus;
}
