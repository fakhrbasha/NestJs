import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerCloud from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorator/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorator/user.decorator';
import type { UserDocument } from 'src/DB/models/user.model';
import { createCartDto, IdDto, QueryDto, updateProductQuantityDto } from './cart.dto';
import { CartService } from './cart.service';
import { Types } from 'mongoose';

@Controller('cart')
export class CartController {

    constructor(
        private readonly CartService: CartService
    ) { }


    @Post()
    @Auth({ access_roles: [RoleEnum.admin] })
    async createCart(
        @Body() body: createCartDto,
        @User() user: UserDocument
    ) {
        return this.CartService.createCart(body, user)
    }
    @Delete(":productId")
    @Auth({ access_roles: [RoleEnum.admin] })
    async removeProductFromCart(
        @Param('productId') productId: Types.ObjectId,
        @User() user: UserDocument
    ) {
        return this.CartService.removeProductFromCart(productId, user)
    }
    @Patch()
    @Auth({ access_roles: [RoleEnum.admin] })
    async updateProductQuantity(
        @Body() body: updateProductQuantityDto,
        @User() user: UserDocument
    ) {
        return this.CartService.updateProductQuantity(body, user)
    }


}
