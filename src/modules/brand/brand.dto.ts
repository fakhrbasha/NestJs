import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, isMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorator/brand.decorator";


export class createBrandDto {

    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    name: string;



    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    slogan: string;


}
AtLeastOne(['name', 'slogan'])
export class updateBrandDto extends PartialType(createBrandDto) {

}
// nextjs/mapped-type for make optional all properties in createBrandDto to use in updateBrandDto


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