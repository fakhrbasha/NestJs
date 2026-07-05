import { Allow, IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, Length, registerDecorator, Validate, ValidateIf, ValidationOptions } from 'class-validator';
import * as z from 'zod';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'ValidateIds', async: false })
export class ValidateIds implements ValidatorConstraintInterface {
    validate(value: string[], args: ValidationArguments) {
        // console.log({ value, args })

        return value.filter(id => Types.ObjectId.isValid(id)).length === value.length
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return `some of id in inValid`;
    }
}
