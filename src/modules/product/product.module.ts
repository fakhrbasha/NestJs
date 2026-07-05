import { Module } from '@nestjs/common';
// import { BrandService } from './category.service';
import TokenService from 'src/common/utils/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import UserRepository from 'src/DB/repo/user.repo';
import { UserModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repo/brand.repo';
import { BrandModel } from 'src/DB/models/brand.model';
import { S3Service } from 'src/common/services/s3.service';
import CategoryRepository from 'src/DB/repo/category.repo';
import { CategoryModel } from 'src/DB/models/category.model';
import { BrandService } from '../brand/brand.service';
import { ProductService } from './product.service';
import { ProductModel } from 'src/DB/models/product.model';
import { ProductController } from './product.controller';
import ProductRepository from 'src/DB/repo/product.repo';


@Module({
  imports: [UserModel, BrandModel, CategoryModel, ProductModel],
  controllers: [ProductController],
  providers: [TokenService, JwtService, UserRepository, BrandRepository, S3Service, CategoryRepository, ProductService, ProductRepository],
})
export class ProductModule { }
