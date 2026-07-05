

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
export class Category {

    @Prop({
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50,
        unique: true
    })
    name: string;
    @Prop({
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50,
        unique: true,
        default: function (this: Category) {
            return slugify(this.name, { replacement: "-", trim: true, lower: true })
            // use third party module slugify to generate slug from name
        }
    })
    slug: string;

    @Prop([{ type: Types.ObjectId, ref: "Brand" }])
    brands: Types.ObjectId[];


    @Prop({ type: String, required: true })
    logo: string;


    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    createdBy: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;
    @Prop({ type: Date })
    deletedAt: Date;



}

export const CategorySchema = SchemaFactory.createForClass(Category)
// hash with hook

CategorySchema.pre(["findOneAndUpdate", "updateOne"], function () {
    const updated = this.getUpdate() as UpdateQuery<Category>
    if (updated && updated.name) {
        updated.slug = slugify(updated.name, { replacement: "-", trim: true, lower: true })
    }
})
export type CategoryDocument = HydratedDocument<Category>

export const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])