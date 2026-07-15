import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createCouponDto, QueryDto, updateProductQuantityDto } from './coupon.dto';
import { type UserDocument } from 'src/DB/models/user.model';
import CouponRepository from 'src/DB/repo/coupon.repo';
import UserRepository from 'src/DB/repo/user.repo';

@Injectable()
export class CouponService {


    constructor(
        private readonly CouponRepo: CouponRepository,
        private readonly userRepo: UserRepository,
    ) { }


    async createCoupon(body: createCouponDto, user: UserDocument) {
        const { code, amount, fromDate, toDate } = body

        const couponExist = await this.CouponRepo.findOne({
            filter: {
                code: code.toLowerCase()
            }
        })
        if (couponExist) {
            throw new ConflictException("coupon already exist")
        }
        const coupon = await this.CouponRepo.create({
            createdBy: user._id,
            code,
            amount,
            fromDate,
            toDate
        })
        return coupon
    }





}
