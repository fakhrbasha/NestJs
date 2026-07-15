import { Module } from '@nestjs/common';
// import { BrandService } from './category.service';
import TokenService from 'src/common/utils/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import UserRepository from 'src/DB/repo/user.repo';
import { UserModel } from 'src/DB/models/user.model';
import { CartController } from './cart.controller';
import CartRepository from 'src/DB/repo/cart.repo';
import { CartService } from './cart.service';
import { CartModel } from 'src/DB/models/cart.model';
import ProductRepository from 'src/DB/repo/product.repo';
import { ProductModel } from 'src/DB/models/product.model';
@Module({
  imports: [UserModel, CartModel, ProductModel],
  controllers: [CartController],
  providers: [TokenService, JwtService, UserRepository, CartRepository, CartService, ProductRepository],
})
export class CartModule { }
