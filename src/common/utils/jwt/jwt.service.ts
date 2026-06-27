
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt'
import { JwtPayload, SignOptions, } from 'jsonwebtoken'
import UserRepository from 'src/DB/repo/user.repo'
// import jwt, { JwtPayload, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken'
const expireDate = '1h'



@Injectable()
class TokenService {
    constructor(
        private jwtService: JwtService,
        private readonly userRepo: UserRepository
    ) { }



    generateToken = ({ payload, options }: { payload: Object, options?: JwtSignOptions }): Promise<string> => {
        return this.jwtService.signAsync(payload, options)
    }

    verifyToken = ({ token, options = {} }: { token: string, options?: JwtVerifyOptions }): Promise<JwtPayload> => {
        return this.jwtService.verifyAsync(token, options)
    }

    getSignature = async (prefix: string) => {

        let ACCESS_SECRET_KEY = "";
        let REFRESH_SECRET_KEY = "";
        if (prefix === process.env.PREFIX_USER) {
            ACCESS_SECRET_KEY =
                process.env.ACCESS_SECRET_KEY_USER!;
            REFRESH_SECRET_KEY =
                process.env.REFRESH_SECRET_KEY_USER!;
        } else if (prefix === process.env.PREFIX_ADMIN) {
            ACCESS_SECRET_KEY =
                process.env.ACCESS_SECRET_KEY_ADMIN!;
            REFRESH_SECRET_KEY =
                process.env.REFRESH_SECRET_KEY_ADMIN!;
        } else {
            throw new BadRequestException(
                "Invalid Prefix Key"
            );
        }
        return { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY }
    }

    decodeToken_and_fetchUser = async (token: string, secret: string) => {
        const decoded = await
            this.verifyToken({
                token,
                options: {
                    secret
                }
            }) as any;

        if (!decoded?.id) {
            throw new BadRequestException(
                "Invalid token"
            );
        }

        const user = await this.userRepo.findOne({
            filter: { _id: decoded.id }
        });

        if (!user) {
            throw new BadRequestException(
                "User not found"
            );
        }

        // if (!user.confirmed) {
        //     throw new BadRequestException(
        //         "User not confirmed"
        //     );
        // }

        return {
            user,
            decoded
        };
    }
}

export default TokenService