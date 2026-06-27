
import { Injectable, CanActivate, ExecutionContext, BadRequestException, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import TokenService from '../utils/jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { TokenEnum } from '../enum/token.enum';
import { token_type_key } from '../decorator/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService,
        private reflector: Reflector
    ) { }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {


        // const tokenType = this.reflector.get("tokenType" , context.getHandler())// around endpoint
        // const tokenType = this.reflector.get("tokenType", context.getHandler())// around class
        // const tokenType = this.reflector.getAll("tokenType", [context.getHandler(),context.getClass()])// around class


        const tokenType = this.reflector.getAllAndOverride<TokenEnum>(
            token_type_key,
            [context.getHandler(), context.getClass()]
        );
        // console.log({ tokenType })


        let req: any = ""
        let authorization: any = ""

        if (context.getType() === "http") {
            req = context.switchToHttp().getRequest()
            authorization = req.headers.authorization
        } else if (context.getType() === "rpc") {
            req = context.switchToRpc()
            // authorization = 
        } else if (context.getType() === "ws") {
            // req = context.switchToWs().getContext()
            // authorization = 
        }

        const request = context.switchToHttp().getRequest();

        if (!authorization) {
            throw new BadRequestException("Unauthorized");
        }
        const [prefix, token] =
            authorization.split(" ");

        if (!token || !prefix) {
            throw new BadRequestException(
                "Invalid token format"
            );
        }
        // console.log({
        //     authorization,
        //     prefix,
        //     token,
        // });
        const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = await this.tokenService.getSignature(prefix)
        // console.log({
        //     ACCESS_SECRET_KEY,
        // });

        // console.log(token);
        let secret = tokenType == TokenEnum.access_token ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY

        try {
            var { decoded, user } = await this.tokenService.decodeToken_and_fetchUser(token, secret)

        } catch (error) {
            throw new HttpException({ message: "invalid token", error }, 400)
        }


        req.user = user
        req.decoded = decoded
        return true
        // return validateRequest(request);
    }
}
