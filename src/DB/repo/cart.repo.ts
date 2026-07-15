import { HydratedDocument, PopulateOptions, ProjectionType, Query, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose";
import { Model } from "mongoose";
import BaseRepository from "./base.repo";
import { User, UserModel } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Category } from "../models/category.model";
import { Cart } from "../models/cart.model";

@Injectable()
class CartRepository extends BaseRepository<Cart> {

    constructor(@InjectModel(Cart.name) protected model: Model<Cart>) {
        super(model)
    }
}

export default CartRepository;