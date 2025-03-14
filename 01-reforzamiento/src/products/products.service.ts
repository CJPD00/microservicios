import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { v4 as v4ID } from 'uuid';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  create(createProductDto: CreateProductDto) {
    //console.log(createProductDto.name);

    const newProduct = new Product(
      v4ID(),
      createProductDto.name,
      createProductDto.description,
      createProductDto.price,
    );

    //console.log(newProduct);

    this.products.push(newProduct);
  }

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const product = this.products.find((product) => product.id === id);

    if (!product) throw new NotFoundException('Product not found');

    if (updateProductDto.name) product.name = updateProductDto.name;
    if (updateProductDto.description)
      product.description = updateProductDto.description;
    if (updateProductDto.price) product.price = updateProductDto.price;

    this.products = this.products.filter((product) => product.id !== id);

    this.products.push(product);
  }

  remove(id: string) {
    const product = this.products.find((product) => product.id == id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    this.products = this.products.filter((product) => product.id !== id);
  }
}
