import { Body, Controller, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import multerCloud from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorator/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorator/user.decorator';
import type { UserDocument } from 'src/DB/models/user.model';
import { createProductDto, IdDto, QueryDto } from './product.dto';
import { ProductService } from "./product.service"

@Controller('product')
export class ProductController {

    constructor(
        private readonly ProductService: ProductService
    ) { }


    @Post()
    @Auth({ access_roles: [RoleEnum.admin] })
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
    ], multerCloud()))
    async createProduct(
        @Body() body: createProductDto,
        @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] },
        @User() user: UserDocument
    ) {
        return this.ProductService.createProduct(body, files, user)
    }

}
