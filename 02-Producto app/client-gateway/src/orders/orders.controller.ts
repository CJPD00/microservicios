import {
  Controller,
  Get,
  Post,
  Body,
  //Patch,
  Param,
  //Delete,
  Inject,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
//import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.send('createOrder', createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.send('findAllOrders', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.send('findOneOrder', id);
  }
}
