import { HydratedDocument, PopulateOptions, ProjectionType, Query, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose";
import { Model } from "mongoose";
import BaseRepository from "./base.repo";
import { User, UserModel } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Brand } from "../models/brand.model";

@Injectable()
class BrandRepository extends BaseRepository<Brand> {

    constructor(@InjectModel(Brand.name) protected model: Model<Brand>) {
        super(model)
    }
}

export default BrandRepository;