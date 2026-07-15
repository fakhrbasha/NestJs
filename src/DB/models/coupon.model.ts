

import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, UpdateQuery } from "mongoose";
import { GenderEnum, RoleEnum } from "src/common/enum/user.enum";
import { Hash } from "src/common/utils/security/hash.security";
import slugify from "slugify";
import { User } from "./user.model";
import { Product } from "./product.model";



@Schema({
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Coupon {



    @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
    usedBy: Types.ObjectId;


    @Prop({ type: Number, min: 1, max: 100, required: true })
    amount: number;

    @Prop({ type: String, unique: true, required: true, lowerCase: true })
    code: string;


    @Prop({ type: Types.ObjectId, ref: User.name })
    createdBy: Types.ObjectId;



    @Prop({ type: Date, required: true })
    fromDate: Date;
    @Prop({ type: Date, required: true })
    toDate: Date;



}

export const couponSchema = SchemaFactory.createForClass(Coupon)

export type CouponDocument = HydratedDocument<Coupon>

export const CouponModel = MongooseModule.forFeature([{ name: Coupon.name, schema: couponSchema }])