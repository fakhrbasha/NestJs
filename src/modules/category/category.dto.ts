import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, isMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Validate } from "class-validator";
import { Types } from "mongoose";
import { ValidateIds } from "src/common/decorator/category.decorator";


export class createCategoryDto {

    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    name: string;

    @Validate(ValidateIds)
    brands: Types.ObjectId[]

}
// AtLeastOne(['name', 'slogan'])
export class updateCategoryDto extends PartialType(createCategoryDto) {

}
// nextjs/mapped-type for make optional all properties in createCategoryDto to use in updateCategoryDto


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