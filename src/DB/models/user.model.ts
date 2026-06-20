

import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { GenderEnum, RoleEnum } from "src/common/enum/user.enum";
import { Hash } from "src/common/utils/security/hash.security";

@Schema({
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class User {

    @Prop({
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    })
    userName: string;



    // @Virtual(({
    //     set:function(this:any,value:any){
    //         this
    //     },
    //     get:function(this){} .....
    // }))
    // userName?:string


    @Prop({ type: String, required: true, unique: true, trim: true })
    email: string;


    @Prop({ type: Number, required: true, min: 15, max: 60 })
    age: number;


    @Prop({ type: String, trim: true })
    phone?: string;


    @Prop({ type: String })
    address?: string;


    @Prop({
        type: String, required: true,
        trim: true, min: 6, max: 100
    })
    password: string;


    @Prop({ type: Boolean })
    confirmed?: boolean;


    @Prop({ type: String, enum: GenderEnum, default: GenderEnum.male })
    gender?: GenderEnum;


    @Prop({ type: String })
    profilePic?: string;


    @Prop({ type: String, enum: RoleEnum, default: RoleEnum.user })
    role?: RoleEnum
}

export const UserSchema = SchemaFactory.createForClass(User)
// hash with hook
UserSchema.pre('save', function () {
    // console.log(this)
    if (this.isModified("password")) {
        this.password = Hash({ plan_text: this.password })
    }
})
export type UserDocument = HydratedDocument<User>

export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])

// and in module use this mode import it