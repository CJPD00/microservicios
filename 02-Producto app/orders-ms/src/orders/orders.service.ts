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
import { PRODUCT_SERVICE } from 'src/config/services';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
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
        this.productsClient.send({ cmd: 'validate_product' }, ids),
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
      });

      return order;
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
