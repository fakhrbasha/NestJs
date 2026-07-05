import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
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
import { CategoryService } from './category.service';

@Module({
  imports: [UserModel, BrandModel, CategoryModel],
  controllers: [CategoryController],
  providers: [TokenService, JwtService, UserRepository, BrandRepository, S3Service, CategoryRepository, CategoryService],
})
export class CategoryModule { }
