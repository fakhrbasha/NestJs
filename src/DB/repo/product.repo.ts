import { HydratedDocument, PopulateOptions, ProjectionType, Query, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose";
import { Model } from "mongoose";
import BaseRepository from "./base.repo";
import { User, UserModel } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Product } from "../models/product.model";

@Injectable()
class ProductRepository extends BaseRepository<Product> {

    constructor(@InjectModel(Product.name) protected model: Model<Product>) {
        super(model)
    }
}

export default ProductRepository;