import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandService } from './brand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerCloud from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorator/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorator/user.decorator';
import type { UserDocument } from 'src/DB/models/user.model';
import { createBrandDto, IdDto, QueryDto, updateBrandDto } from './brand.dto';

@Controller('brand')
export class BrandController {

    constructor(
        private readonly brandService: BrandService
    ) { }


    @Post()
    @Auth({ access_roles: [RoleEnum.admin] })
    @UseInterceptors(FileInterceptor('attachment', multerCloud()))
    async createBrand(
        @Body() body: createBrandDto,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @User() user: UserDocument
    ) {
        return this.brandService.createBrand(body, file, user)
    }
    @Patch(":id")
    @Auth({ access_roles: [RoleEnum.admin] })
    async updateBrand(
        @Param() params: IdDto,
        @Body() body: updateBrandDto,
        @User() user: UserDocument
    ) {
        return this.brandService.updateBrand(body, params.id, user)
    }
    @Get(":id")
    async getBrandById(
        @Param() params: IdDto,
    ) {
        return this.brandService.getBrandById(params.id)
    }


    @Get()
    getAllBrands(
        @Query() query: QueryDto
    ) {
        return this.brandService.getAllBrands(query)
    }
    @Delete(":id")
    async deleteBrand(
        @Param() params: IdDto,
    ) {
        return this.brandService.deleteBrand(params.id)
    }

}
