import { HydratedDocument, PopulateOptions, ProjectionType, Query, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose";
import { Model } from "mongoose";
import BaseRepository from "./base.repo";
import { User, UserModel } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
class UserRepository extends BaseRepository<User> {

    constructor(@InjectModel(User.name) protected model: Model<User>) {
        super(model)
    }
}

export default UserRepository;