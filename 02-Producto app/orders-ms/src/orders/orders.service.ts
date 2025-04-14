/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination-dto';
//import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStatusDto } from './dto/update.status.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    void (await this.$connect());
    this.logger.log('OrdersService initialized');
  }

  create(createOrderDto: CreateOrderDto) {
    
    

  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const page: number = orderPaginationDto.page ?? 1;
    const limit: number = orderPaginationDto.limit ?? 10;
    const status = orderPaginationDto.status;
    const totalPage =
      (await this.order.count({ where: { status: status } })) / limit;

    // return this.order.findMany({
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   where: {
    //     status: status,
    //   },
    // });

    return {
      data: await this.order.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          status: status,
        },
      }),
      meta: {
        page: page,
        totalPage: Math.ceil(totalPage),
      },
    };
  }

  async findOne(id: string) {
    //console.log('estoy aqui');
    const result = await this.order.findUnique({ where: { id } });

    //console.log(result);

    if (!result) {
      throw new RpcException({
        message: 'Order not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return result;
  }

  async changeStatus(updateStatusDto: UpdateStatusDto) {
    await this.findOne(updateStatusDto.id);

    return await this.order.update({
      where: {
        id: updateStatusDto.id,
      },
      data: {
        status: updateStatusDto.status,
      },
    });
  }
}
