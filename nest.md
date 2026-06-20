# npx @nestjs/cli new .

- t0 create nest project in same folder
- controller
- module -> link between controller and service
- service

- generate module in src create folder modules
- create controller and module and service

### create module user

- first create folder modules and in this folder create `user.service.ts` and `user.module.ts` and `user.controller.ts`

- in `userService` create class type `@Injectable`

- in `user.controller` create class type `@Controller("her put route")

```ts

@Controller("users") /users
export class UserController{

    constructor (private readonly userService:UserService){}

    // @method
    @Post
    createUser() : object //returnValue need to return value from user service make ctor and add userService
    {
        // return this.userService.serviceName
        return this.userService.createUser
    }

}


```

- in `module`

```ts
@Module({
  // to lint it
  import: [],
  controller: [controllerName],
  provider: [serviceName],
  exports: [],
})
export class UserModule {}
```

- then in app module link UserModule

- sample from all at least

> controller

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() body: any): object {
    return body;
    // return this.userService.createUser()
  }
}
```

> service

```ts
import { Body, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  createUser() {
    return 'Body';
  }
}
```

> module

```ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
```

> app module

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Validation

### > pipe

**_A pipe is a class annotated with the @Injectable() decorator, which implements the PipeTransform interface._**

- built in pipes
  > `ParseIntPipe`
  - if send number as str this pipe convert it to number

```ts
    createUser(@Body("age" , ParseIntPipe) age: number): any {
        return age
    }
```

- if send value not number this response

```js
{
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request",
    "statusCode": 400
}
```

- if send float number also has error if you need send float number use `ParseFloatPipe`
- `ParseBoolPipe` -> true , false only
- `ParseEnumPipe` ->

```ts
    createUser(@Body("age" , new ParseEnumPipe([30,26])) age: number): any {
        return age
    }
```

- `DefaultValuePipe`

```ts
    createUser(@Body("age" ,new DefaultValuePipe(22), new ParseEnumPipe([30,26]) ) age: number): any {
        return age
    }
```

> options in pipe

```ts
    createUser(@Body("age" , new ParseBoolPipe({
        optional : by default false if make true make field optional
        // override status code
        errorHttpStatusCode:401
    }) ) age: number): any {
        return age
    }
```

> custom pipes

- create folder common and in common create file `user.pipe.ts`
- and take this code from docs copy paste

- first in controller apply validation

```ts
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body(new ValidationPipe()) body: CreateUserDto): any {
    return body;
  }
}
```

- in `user.pipe.ts`

```ts
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log({ value, metadata });
    return value;
  }
}
```

- this response

```ts
{
  value: { name: 'ahmed', age: 22, password: '123123', cPassword: '123123' },
  metadata: { type: 'body', data: undefined }
}
```

- pass&cPass

```ts
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log({ value, metadata });
    if (value.password !== value.cPassword) {
      throw new HttpException('password not match confirm password', 400);
    }
    return value;
  }
}

// response
{
    "statusCode": 400,
    "message": "password not match confirm password"
}
```

- pipe didn't make match another to field because make const about compare pass and cPass `DRY`

### > ZOD

- take code from docs and add some edits

```ts

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
```

- to make validation need schema and value
- make schema in user.dto.ts

```ts
import * as z from 'zod';
export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name is too long'),

    email: z.string().email('Invalid email address'),

    password: z.string().min(8, 'Password must be at least 8 characters'),
    cPassword: z.string().min(8, 'Password must be at least 8 characters'),

    age: z.number().int().positive().optional(),
  })
  .superRefine((args, ctx) => {
    if (args.password !== args.cPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['cPassword'],
        message: 'password not match with cPassword',
      });
    }
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
```

- and in controller

```ts
    @Post()
    createUser(@Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto): any {
        return body
    }
```

### > class validator

- this npm package
  [class validator](https://www.npmjs.com/package/class-validator)

```ts
$ npm i --save class-validator class-transformer
```

- create class `createUserDto` and add property and in top this prop add decorator

```ts
export class CreateUserDto {
  // @Length(min,max)
  // customize message
  @Length(3, 15, { message: 'name is to short' })
  @IsNotEmpty()
  @IsString({ message: 'name must be str' })
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  age: number;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  //@Allow() // this decorator to allow from error decorator in validationPipe
  // make custom validation to refine pass
  //  in npm doc validation search about custom validation
  // take code copy
  @Validate(matchPassword)
  cPassword: string;

  // decorator run from down to up
}
```

- in confirm password not has a decorator we make custom decorator

```ts
@ValidatorConstraint({ name: 'customText', async: false })
export class matchPassword implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // console.log({ value, args })
    return args.property === args.object['password'];
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} not match with password`;
  }
}
```

- and in controller update it and contain some options if you need it

```ts
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(
    @Body(
      new ValidationPipe({
        whitelist: true, // default false any value in class dto not decorated skip it
        forbidNonWhitelisted: true, // make error about this non decorated property
        stopAtFirstError: true, // show first error when fix show next
        // errorHttpStatusCode: 401
      }),
    )
    body: CreateUserDto,
  ): any {
    // body.age="hi" syntax error now after create dto
    // i need receive age only
    return body;
    // return this.userService.createUser()
  }
}
```

> custom decorator

```ts
@ValidatorConstraint({ name: 'matchKey', async: false })
export class matchKey implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // console.log({ value, args })
    return args.value === args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} not match with ${args.constraints[0]}`;
  }
}

// custom decorator

export function IsMatch(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
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
```

- and use it

```ts
    @IsMatch(['password'])
    cPassword: string;
```

### Binding_pipe

### connection db

- in `app.module.ts`
  in imports add uri

```tsx
MongooseModule.forRoot('mongodb://localhost:27017/fakhrNest', {
  onConnectionCreate: (connection: Connection) => {
    connection.on('connected', () => console.log('connected db success'));
    // connection.on('open', () => console.log('open'));
    // connection.on('disconnected', () => console.log('disconnected'));
    // connection.on('reconnected', () => console.log('reconnected'));
    // connection.on('disconnecting', () => console.log('disconnecting'));

    return connection;
  },
});
```

### config env

```tsx
npm i --save @nestjs/config
```

- and in app.module.ts in imports

```tsx
    ConfigModule.forRoot(),
```

```tsx
    ConfigModule.forRoot({
      envFilepath:[".env" , ".env.development" , ".env.production"],
      isGlobal:true
    }),
```

- first read from env and etc...

### Generate model
