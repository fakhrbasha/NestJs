import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsDate, IsMongoId, isMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Max, Min, Validate } from "class-validator";
import { Types } from "mongoose";
import { CouponValidator } from "src/common/decorator/coupon.decorator";


export class createCouponDto {

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    code: string;

    // @Validate(ValidateIds)
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100)
    amount: number



    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Validate(CouponValidator)
    fromDate: Date

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    toDate: Date


}
// AtLeastOne(['name', 'slogan'])
export class updateProductQuantityDto extends createCouponDto {

}
// nextjs/mapped-type for make optional all properties in createCouponDto to use in updateCouponDto


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