import { HydratedDocument, PopulateOptions, ProjectionType, Query, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose";
import { Model } from "mongoose";
import BaseRepository from "./base.repo";
import { User, UserModel } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Category } from "../models/category.model";

@Injectable()
class CategoryRepository extends BaseRepository<Category> {

    constructor(@InjectModel(Category.name) protected model: Model<Category>) {
        super(model)
    }
}

export default CategoryRepository;