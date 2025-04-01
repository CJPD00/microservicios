import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() {}

  @Post()
  createProduct() {
    return 'Product created';
  }

  @Get()
  findAllProducts() {
    return 'All products';
  }

  @Get(':id')
  findProduct(@Param('id') id: string) {
    return `find product ${id}`;
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
