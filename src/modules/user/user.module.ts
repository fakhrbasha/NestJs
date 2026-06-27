import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel } from "src/DB/models/user.model";
import UserRepository from "src/DB/repo/user.repo";
import { createClient } from "redis";
import RedisService from "src/common/services/redis.service";
import { RedisModule } from "src/common/redis/redis.module";
import TokenService from "src/common/utils/jwt/jwt.service";
import { JwtService } from "@nestjs/jwt";
import { Authentication } from "src/common/middleware/authentication.middleware";


@Module({
    imports: [UserModel, RedisModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, RedisService, TokenService, JwtService

    ],
    exports: []
})

export class UserModule { }