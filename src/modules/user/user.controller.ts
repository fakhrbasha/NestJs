import { Body, Controller, Get, ParseIntPipe, Post, Req, SetMetadata, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ZodValidationPipe } from "src/common/pipes/user.pipe";
// import { CreateUserDto } from "./UserDto/user.dto";
// import { ValidationPipe } from "src/common/pipes/user.pipe";
import { CreateUserDto, signInDto, } from "./UserDto/user.dto";
import { Authentication } from "src/common/middleware/authentication.middleware";
import { AuthGuard } from "src/common/guards/authentication.guard";
import { TokenEnum } from "src/common/enum/token.enum";
import { Auth, Roles, TokenType } from "src/common/decorator/auth.decorator";
import { AuthorizationGuard } from "src/common/guards/authorization.guard";
import { RoleEnum } from "src/common/enum/user.enum";
import { type UserDocument } from "src/DB/models/user.model";
import { User } from "../../common/decorator/user.decorator"




@Controller('users')
// @UsePipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
// }))
// any api has dto
// and can apply global on site take it and in main file use

// @SetMetadata("tokenType", TokenEnum.access_token) getClass

export class UserController {
    constructor(private userService: UserService) { }

    // @Post()
    // usePipes(pipe) apply validation on body or params DRY and can apply on all controller
    // @UsePipes(new ValidationPipe({
    //     whitelist: true,
    //     forbidNonWhitelisted: true,
    // }))
    // createUser(
    //     @Body() body: CreateUserDto

    // ): any {
    //     return body
    // }

    @Get()
    // @SetMetadata("tokenType", TokenEnum.access_token)
    // @TokenType(TokenEnum.refresh_token)
    @Auth({ token_type: TokenEnum.access_token, access_roles: [RoleEnum.user] }) // auth decorator
    getUsers(@Req() req: any) {
        // console.log(req.user, req.decoded)
        return this.userService.getUsers()
    }

    @Post("/signup")
    signUp(@Body() body: CreateUserDto) {
        return this.userService.signUp(body)
    }
    @Post("/signin")
    signIn(@Body() body: signInDto) {
        return this.userService.signIn(body)
    }


    // @UseGuards(AuthGuard)
    @Auth({ token_type: TokenEnum.access_token, access_roles: [RoleEnum.user] }) // auth decorator

    @Get("/profile")
    profile(@User() user: UserDocument) {
        return { user }
        // return this.userService.signIn(body)
    }
}
