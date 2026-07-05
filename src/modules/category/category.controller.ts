import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerCloud from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorator/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorator/user.decorator';
import type { UserDocument } from 'src/DB/models/user.model';
import { createCategoryDto, IdDto, QueryDto } from './category.dto';

@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }


    @Post()
    @Auth({ access_roles: [RoleEnum.admin] })
    @UseInterceptors(FileInterceptor('attachment', multerCloud()))
    async createCategory(
        @Body() body: createCategoryDto,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @User() user: UserDocument
    ) {
        return this.categoryService.createCategory(body, file, user)
    }
    @Patch(":id")
    @Auth({ access_roles: [RoleEnum.admin] })
    @UseInterceptors(FileInterceptor('attachment', multerCloud()))
    async updateCategory(
        @Body() body: createCategoryDto,
        @Param() params: IdDto,
        // @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @User() user: UserDocument
    ) {
        return this.categoryService.updateCategory(body, params.id, user)
    }
    @Get()
    async getAllCategories(
        @Query() query: QueryDto

    ) {
        return this.categoryService.getAllCategories(query)
    }
    @Get(":id")
    async getCategoryById(
        @Param() params: IdDto,
    ) {
        return this.categoryService.getCategoryById(params.id)
    }
    @Delete(":id")
    async deleteCategory(
        @Param() params: IdDto,
    ) {
        return this.categoryService.deleteCategory(params.id)
    }

}
