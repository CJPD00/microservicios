/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Status must be one of ${OrderStatusList}`,
  })
  status?: OrderStatus;
}
