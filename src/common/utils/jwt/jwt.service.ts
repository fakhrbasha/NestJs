
import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'
// import jwt, { JwtPayload, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken'
const expireDate = '1h'



@Injectable()
class TokenService {
    constructor(private jwtService: JwtService) { }



    generateToken = ({ payload, options }: { payload: Object, options?: JwtSignOptions }): Promise<string> => {
        return this.jwtService.signAsync(payload, options)
    }

    verifyToken = ({ token, options = {} }: { token: string, options?: VerifyOptions }): Promise<JwtPayload> => {
        return this.jwtService.verifyAsync(token, options)
    }
}

export default TokenService