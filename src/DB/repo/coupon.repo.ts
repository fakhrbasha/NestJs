import { Model } from "mongoose";
import BaseRepository from "./base.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Coupon } from "../models/coupon.model";

@Injectable()
class CouponRepository extends BaseRepository<Coupon> {

    constructor(@InjectModel(Coupon.name) protected model: Model<Coupon>) {
        super(model)
    }
}

export default CouponRepository;