import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerCloud from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorator/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorator/user.decorator';
import type { UserDocument } from 'src/DB/models/user.model';
import { createCouponDto } from './coupon.dto';
import { CouponService } from './coupon.service';
import { Types } from 'mongoose';

@Controller('coupon')
export class CouponController {

    constructor(
        private readonly CouponService: CouponService
    ) { }


    @Post()
    @Auth({ access_roles: [RoleEnum.admin] })
    async createCoupon(
        @Body() body: createCouponDto,
        @User() user: UserDocument
    ) {
        return this.CouponService.createCoupon(body, user)
    }


}
