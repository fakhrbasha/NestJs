import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, isMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Min, Validate } from "class-validator";
import { Types } from "mongoose";


export class createCartDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    quantity: number;

    // @Validate(ValidateIds)
    @IsMongoId()
    productId: Types.ObjectId


}
// AtLeastOne(['name', 'slogan'])
export class updateProductQuantityDto extends createCartDto {

}
// nextjs/mapped-type for make optional all properties in createCartDto to use in updateCartDto


export class IdDto {

    @IsNotEmpty()
    @IsMongoId()
    id: Types.ObjectId
}

export class QueryDto {

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number;


    @IsOptional()
    @IsString()
    search?: string;

}