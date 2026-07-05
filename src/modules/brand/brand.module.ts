import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import TokenService from 'src/common/utils/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import UserRepository from 'src/DB/repo/user.repo';
import { UserModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repo/brand.repo';
import { BrandModel } from 'src/DB/models/brand.model';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  imports: [UserModel, BrandModel],
  controllers: [BrandController],
  providers: [BrandService, TokenService, JwtService, UserRepository, BrandRepository, S3Service]
})
export class BrandModule { }
