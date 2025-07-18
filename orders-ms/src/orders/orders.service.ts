/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination-dto';
//import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStatusDto } from './dto/update.status.dto';
import { NATS_SERVICES } from 'src/config/services';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(@Inject(NATS_SERVICES) private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    void (await this.$connect());
    this.logger.log('OrdersService initialized');
  }

  async create(createOrderDto: CreateOrderDto) {
    const ids = createOrderDto.items.map((item) => item.productId);

    try {
      const products: any[] = await firstValueFrom(
        this.client.send({ cmd: 'validate_product' }, ids),
      );

      const totalAmount = createOrderDto.items.reduce((total, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;

        return price * orderItem.quantity + total;
      }, 0);

      const totalItems = createOrderDto.items.reduce((total, orderItem) => {
        return orderItem.quantity + total;
      }, 0);

      const orderItems = createOrderDto.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: products.find((product) => product.id === item.productId).price,
      }));

      //Crear una transaccion de base de datos
      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          OrderItem: {
            createMany: {
              data: orderItems,
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              productId: true,
              quantity: true,
              price: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderItem: order.OrderItem.map((item) => ({
          ...item,
          name: products.find((product) => product.id === item.productId).name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        //status:"200"
      });
    }
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
    const result = await this.order.findUnique({
      where: { id },
      include: {
        OrderItem: {
          select: {
            productId: true,
            quantity: true,
            price: true,
          },
        },
      },
    });

    //console.log(result);

    if (!result) {
      throw new RpcException({
        message: 'Order not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    const productsIds = result.OrderItem.map((item) => item.productId);
    const products = await firstValueFrom(
      this.client.send({ cmd: 'validate_product' }, productsIds),
    );

    return {
      ...result,
      OrderItem: result.OrderItem.map((item) => ({
        ...item,
        name: products.find((product) => product.id === item.productId).name,
      })),
    };
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
