

import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, UpdateQuery } from "mongoose";
import { GenderEnum, RoleEnum } from "src/common/enum/user.enum";
import { Hash } from "src/common/utils/security/hash.security";
import slugify from "slugify";
import { User } from "./user.model";
@Schema({
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Product {

    @Prop({
        type: String,
        required: true,
        trim: true,
        min: 2,
    })
    name: string;
    @Prop({
        type: String,
        required: true,
        trim: true,
        min: 2,
    })
    description: string;
    @Prop({
        type: String,
        required: true,
        trim: true,
        min: 2,
        unique: true

    })
    slug: string;

    @Prop([{ type: Types.ObjectId, ref: "Brand", required: true }])
    brandId: Types.ObjectId[];
    @Prop([{ type: Types.ObjectId, ref: "Category", required: true }])
    categoryId: Types.ObjectId[];
    // @Prop([{ type: Types.ObjectId, ref: "Brand" }])
    // subCategory: Types.ObjectId[];


    @Prop({ type: String, required: true })
    mainImage: string;

    @Prop({ type: [String] })
    subImages: string[];

    @Prop({
        type: Number,
        required: true,

    })
    price: number;
    @Prop({
        type: Number,

    })
    discount: number;
    @Prop({
        type: Number,
        required: true,

    })
    stock: number;
    @Prop({
        type: Number,

    })
    rateNumber: number;
    @Prop({
        type: Number,

    })
    rateAverage: number;

    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    createdBy: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;
    @Prop({ type: Date })
    deletedAt: Date;



}

export const ProductSchema = SchemaFactory.createForClass(Product)
// hash with hook

ProductSchema.pre(["findOneAndUpdate", "updateOne"], function () {
    const updated = this.getUpdate() as UpdateQuery<Product>
    if (updated && updated.name) {
        updated.slug = slugify(updated.name, { replacement: "-", trim: true, lower: true })
    }
})
export type ProductDocument = HydratedDocument<Product>

export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])