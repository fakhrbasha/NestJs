import { Body, Controller, Get, ParseIntPipe, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ZodValidationPipe } from "src/common/pipes/user.pipe";
// import { CreateUserDto } from "./UserDto/user.dto";
// import { ValidationPipe } from "src/common/pipes/user.pipe";
import { CreateUserDto, signInDto, } from "./UserDto/user.dto";




@Controller('users')
// @UsePipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
// }))
// any api has dto
// and can apply global on site take it and in main file use
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
    getUsers() {
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
}