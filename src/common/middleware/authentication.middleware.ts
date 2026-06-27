
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import TokenService from '../utils/jwt/jwt.service';

@Injectable()
export class Authentication implements NestMiddleware {
    constructor(
        private readonly tokenService: TokenService
    ) { }
    use(req: Request, res: Response, next: NextFunction) {
        // console.log(req.body);
        // console.log(req.headers.authorization);
        // call getSignature
        // call fetchUser_decode

        console.log('Request...');
        next();
    }
}


