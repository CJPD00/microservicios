import {
  //BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
//import { ErrorInterface } from 'src/common/interfaces/errorInterface';
//import { ProductInterface } from 'src/common/interfaces/productInterface';
import { PRODUCT_SERVICE } from 'src/config/services';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsService: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() body: any) {
    return this.productsService.send({ cmd: 'create_product' }, body);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsService.send(
      { cmd: 'findAll_products' },
      paginationDto,
    );
  }

  @Get(':id')
  findProduct(@Param('id') id: string) {
    return this.productsService.send({ cmd: 'findOne_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );

    // try {
    //   const product: ProductInterface = await firstValueFrom(
    //     this.productsService.send({ cmd: 'findOne_product' }, { id }),
    //   );

    //   return product;
    // } catch (error) {
    //   throw new RpcException(error as ErrorInterface);
    // }
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return 'Product updated ' + id + body;
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return 'Product deleted' + id;
  }
}
