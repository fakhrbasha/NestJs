import { Allow, IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, Length, registerDecorator, Validate, ValidateIf, ValidationOptions } from 'class-validator';
import * as z from 'zod';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'matchKey', async: false })
export class matchKey implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        // console.log({ value, args })
        return args.value === args.object[args.constraints[0]]
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return `${args.property} not match with ${args.constraints[0]}`;
    }
}

// custom decorator

export function IsMatch(constraints: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: matchKey,
        });
    };
}



export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
