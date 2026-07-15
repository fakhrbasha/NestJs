

import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, UpdateQuery } from "mongoose";
import { GenderEnum, RoleEnum } from "src/common/enum/user.enum";
import { Hash } from "src/common/utils/security/hash.security";
import slugify from "slugify";
import { User } from "./user.model";
import { Product } from "./product.model";


@Schema()
export class CartProduct {
    @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
    productId: Types.ObjectId;

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({ type: Number, required: true })
    finalPrice: number;
}

export const CartProductSchema = SchemaFactory.createForClass(CartProduct)
@Schema({
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Cart {


    @Prop({ type: [CartProductSchema], required: true })
    products: CartProduct[];


    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    createdBy: Types.ObjectId;


    @Prop({ type: Number })
    subTotal: number;



    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;



    @Prop({ type: Date })
    deletedAt: Date;



}

export const CartSchema = SchemaFactory.createForClass(Cart)
// hash with hook
// console.log(CartSchema.obj)
CartSchema.pre("save", function () {
    if (!this.products || this.products.length === 0) {
        this.subTotal = 0
        return
    }

    this.subTotal = this.products.reduce(
        (total, product) => total + (product.quantity * product.finalPrice),
        0
    )
})
export type CartDocument = HydratedDocument<Cart>

export const CartModel = MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])