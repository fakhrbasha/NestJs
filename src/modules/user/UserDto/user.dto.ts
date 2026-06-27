import { Allow, IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, Length, registerDecorator, Validate, ValidateIf, ValidationOptions } from 'class-validator';
import * as z from 'zod';

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { IsMatch } from 'src/common/decorator/user.decorator';

export class CreateUserDto {


    // @Length(min,max)
    // customize message
    @Length(3, 15, { message: "name is to short" })
    @IsNotEmpty()
    @IsString({ message: "name must be str" })
    userName: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsInt()
    age: number;


    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @Allow() // this decorator to allow from error decorator in validationPipe
    // make custom validation to refine pass 
    //  in npm doc validation search about custom validation
    // take code copy 
    // @Validate(matchPassword)


    // check if password write or not use ValidateIf

    @ValidateIf((data: CreateUserDto) => {
        return Boolean(data.password)
    }) // check write pass or not has poriaiorty high
    @IsMatch(['password'])
    cPassword: string;

    // decorator run from down to up
}
export class signInDto {


    @IsNotEmpty()
    @IsEmail()
    email: string;



    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

}
// to fix error in tsconfig
// "strictPropertyInitialization": false


// export const createUserSchema = z.object({
//     name: z
//         .string()
//         .min(3, 'Name must be at least 3 characters')
//         .max(50, 'Name is too long'),

//     email: z
//         .string()
//         .email('Invalid email address'),

//     password: z
//         .string()
//         .min(8, 'Password must be at least 8 characters'),
//     cPassword: z
//         .string()
//         .min(8, 'Password must be at least 8 characters'),

//     age: z
//         .number()
//         .int()
//         .positive()
//         .optional(),
// }).superRefine((args, ctx) => {
//     if (args.password !== args.cPassword) {
//         ctx.addIssue({
//             code: "custom",
//             path: ["cPassword"],
//             message: "password not match with cPassword"
//         })
//     }
// })

// export type CreateUserDto = z.infer<typeof createUserSchema>;