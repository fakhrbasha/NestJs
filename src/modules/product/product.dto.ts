import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, isMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Max, Min, Validate } from "class-validator";
import { Types } from "mongoose";
import { ValidateIds } from "src/common/decorator/category.decorator";


export class createProductDto {

    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Length(2, 50000)
    description: string;

    @IsNotEmpty()
    @IsMongoId()
    brandId: Types.ObjectId
    @IsNotEmpty()
    @IsMongoId()
    categoryId: Types.ObjectId

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    price?: number;


    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    discount?: number;


    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    stock?: number;



}
// AtLeastOne(['name', 'slogan'])
export class updateProductDto extends PartialType(createProductDto) {

}
// nextjs/mapped-type for make optional all properties in createProductDto to use in updateProductDto


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