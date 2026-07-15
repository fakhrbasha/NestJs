import { Allow, IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, Length, registerDecorator, Validate, ValidateIf, ValidationOptions } from 'class-validator';
import * as z from 'zod';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'CouponValidator', async: false })
export class CouponValidator implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        const obj = args.object as any
        const fromDate = new Date(obj.fromDate)
        const toDate = new Date(obj.toDate)
        const now = new Date()

        return fromDate >= now && fromDate < toDate

    }

    defaultMessage(args: ValidationArguments) {
        return `from Date must be greater than or equal now and less than toDate`;
    }
}
