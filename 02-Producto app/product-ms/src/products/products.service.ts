/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  HttpStatus,
  Injectable,
  Logger,
  //NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    void this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const page: number = paginationDto.page ?? 1;
    const limit: number = paginationDto.limit ?? 10;

    const totalPage =
      (await this.product.count({ where: { available: true } })) / limit;

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        },
      }),
      meta: {
        page: page,
        totalPage: Math.ceil(totalPage),
      },
    };
  }

  async findOne(id: number) {
    const result = await this.product.findUnique({
      where: { id, available: true },
    });

    //this.logger.log(result);

    if (!result) {
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.BAD_REQUEST,
        //status:"200"
      });
    }

    return result;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({ where: { id }, data: data });
  }

  async remove(id: number) {
    await this.findOne(id);

    //return this.product.delete({ where: { id } });

    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }

  async validateProduct(ids: number[]) {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
        available: true,
      },
    });

    if (products.length !== ids.length) {
      throw new Error('Products not found');
    }

    return products;
  }
}
