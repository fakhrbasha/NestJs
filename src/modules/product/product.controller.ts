import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import multerCloud from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorator/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorator/user.decorator';
import type { UserDocument } from 'src/DB/models/user.model';
import { createProductDto, IdDto, QueryDto, updateProductDto } from './product.dto';
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
    @Get()
    async getAllProduct(
        @Query() query: QueryDto

    ) {
        return this.ProductService.getAllProducts(query)
    }
    @Get(":id")
    async getProductById(
        @Param() params: IdDto,
    ) {
        return this.ProductService.getProductById(params.id)
    }
    @Delete(":id")
    async deleteProduct(
        @Param() params: IdDto,
    ) {
        return this.ProductService.deleteProduct(params.id)
    }
    @Patch(":id")
    @Auth({ access_roles: [RoleEnum.admin] })
    async updateProduct(
        @Body() body: updateProductDto,
        @Param() params: IdDto,
        @User() user: UserDocument
    ) {
        return this.ProductService.updateProduct(body, params.id, user)
    }


}
