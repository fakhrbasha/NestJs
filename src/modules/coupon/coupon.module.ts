import { Module } from '@nestjs/common';
// import { BrandService } from './category.service';
import TokenService from 'src/common/utils/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import UserRepository from 'src/DB/repo/user.repo';
import { UserModel } from 'src/DB/models/user.model';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import ProductRepository from 'src/DB/repo/product.repo';
import { ProductModel } from 'src/DB/models/product.model';
import { CouponModel } from 'src/DB/models/coupon.model';
import CouponRepository from 'src/DB/repo/coupon.repo';
@Module({
  imports: [UserModel, CouponModel],
  controllers: [CouponController],
  providers: [TokenService, JwtService, UserRepository, CouponRepository, CouponService],
})
export class CouponModule { }
