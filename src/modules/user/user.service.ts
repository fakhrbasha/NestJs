import { BadRequestException, Body, ConflictException, Injectable } from "@nestjs/common";
import UserRepository from "src/DB/repo/user.repo";
import { CreateUserDto, signInDto } from "./UserDto/user.dto";
import { Compare, Hash } from "src/common/utils/security/hash.security";
import { encrypt } from "src/common/utils/security/encrypt.security";
import { sendEmail, sendOtp } from "src/common/utils/mail/mail";
import { eventEmitter } from "src/common/utils/mail/email.event";
import { EmailEnum, RoleEnum } from "src/common/enum/user.enum";
import { templateEmail } from "src/common/utils/mail/email.template";
import RedisService from "src/common/services/redis.service";
import { randomUUID } from "crypto";
import TokenService from "src/common/utils/jwt/jwt.service";




@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly redisService: RedisService,
        private readonly tokenService: TokenService


    ) {

    }

    async getUsers() {
        return await this.userRepository.find({})
    }
    async signUp(body: CreateUserDto) {
        const { age, cPassword, email, password, phone, userName } = body
        const emailExist = await this.userRepository.findOne({
            filter: { email }
        })
        if (emailExist) {
            throw new ConflictException("email already exist")
        }
        const otp = await sendOtp()
        eventEmitter.emit(EmailEnum.confirmedEmail, async () => {
            await sendEmail({ to: email, subject: "email configuration", html: templateEmail(otp) })
            await this.redisService.setValue({ key: this.redisService.otpKey({ email, subject: EmailEnum.confirmedEmail }), value: Hash({ plan_text: `${otp}` }), ttl: 60 * 5 })
            await this.redisService.setValue({ key: this.redisService.max_otp_key({ email }), value: "1", ttl: 60 * 30 })
        })
        const user = await this.userRepository.create({
            // age, email, password: Hash({ plan_text: password }), phone: encrypt(phone), userName
            age, email, password, phone: encrypt(phone), userName
        })
        return user
    }

    async signIn(body: signInDto) {
        const { email, password } = body;

        const user = await this.userRepository.findOne({ filter: { email } });

        if (!user) {
            throw new BadRequestException("Invalid email or password");
        }

        if (!Compare({ plan_text: password, cipher_text: user.password })) {
            throw new BadRequestException("Invalid email or password");
        }
        const uuid = randomUUID()

        const access_token = await this.tokenService.generateToken({
            payload: { id: user._id, email: user.email },
            // secretKey: user?.role == RoleEnum.user ? process.env.ACCESS_SECRET_KEY_USER : process.env.ACCESS_SECRET_KEY_ADMIN,
            options: {
                jwtid: uuid,
                secret: user?.role == RoleEnum.user ? process.env.ACCESS_SECRET_KEY_USER : process.env.ACCESS_SECRET_KEY_ADMIN,
                expiresIn: "1day"
            }
        });
        const refresh_token = await this.tokenService.generateToken({
            payload: { id: user._id, email: user.email },
            // secretKey:
            options: { jwtid: uuid, secret: user?.role == RoleEnum.user ? process.env.REFRESH_SECRET_KEY_USER : process.env.REFRESH_SECRET_KEY_ADMIN, expiresIn: "1y" }
        })


        return { access_token, refresh_token }

    }
}