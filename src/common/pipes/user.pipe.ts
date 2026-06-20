import { ArgumentMetadata, HttpException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodType } from "zod";


// @Injectable()
// export class ValidationPipe implements PipeTransform {
//     transform(value: any, metadata: ArgumentMetadata) {
//         console.log({ value, metadata })
//         if (value.password !== value.cPassword) {
//             throw new HttpException("password not match confirm password", 400)
//         }
//         return value;
//     }
// }


@Injectable()

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        const { success, error } = this.schema.safeParse(value);
        if (!success) {
            throw new HttpException({
                message: "Validation Error",
                error: error.issues.map((issue) => {
                    return {
                        path: issue.path,
                        message: issue.message
                    }
                })
            }, 400)
        }
        return value
    }
}

//