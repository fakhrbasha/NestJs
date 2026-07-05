import { Allow, IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, Length, registerDecorator, Validate, ValidateIf, ValidationOptions } from 'class-validator';
import * as z from 'zod';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';



// custom decorator

export function AtLeastOne(requiredFields: string[], validationOptions?: ValidationOptions) {
    return function (constructor: Function) {
        registerDecorator({
            target: constructor,
            propertyName: "",
            options: validationOptions,
            constraints: requiredFields,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    return requiredFields.some(field => args.object[field]);
                },

                defaultMessage(args: ValidationArguments) {
                    return `At least one of the following fields is required: ${requiredFields.join(', ')}`;
                }
            },
        });
    };
}

