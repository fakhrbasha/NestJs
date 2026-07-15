import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createCartDto, QueryDto, updateProductQuantityDto } from './cart.dto';
import { type UserDocument } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repo/brand.repo';
import { S3Service } from 'src/common/services/s3.service';
import { Types } from 'mongoose';
import CategoryRepository from 'src/DB/repo/category.repo';
import CartRepository from 'src/DB/repo/cart.repo';
import ProductRepository from 'src/DB/repo/product.repo';

@Injectable()
export class CartService {


    constructor(
        private readonly cartRepo: CartRepository,
        private readonly productRepo: ProductRepository,
    ) { }


    async createCart(body: createCartDto, user: UserDocument) {

        const { productId, quantity } = body

        const product = await this.productRepo.findOne({
            filter: {
                _id: productId,
                stock: { $gte: quantity }
            }
        })
        if (!product) {
            throw new BadRequestException("product not found or out of stock")
        }
        const cart = await this.cartRepo.findOne({
            filter: {
                createdBy: user._id
            }
        })
        if (!cart) {
            const newCart = await this.cartRepo.create({
                createdBy: user._id,
                products: [
                    {
                        productId: product._id,
                        quantity,
                        finalPrice: product.price
                    }
                ]
            })
            return newCart
        }
        const productExist = cart.products.find(
            (p) => p.productId.toString() === productId.toString()
        )
        if (productExist) {
            throw new BadRequestException("product already in cart")
        }
        cart.products.push({
            productId: product._id,
            quantity,
            finalPrice: product.price
        })

        await cart.save()
        return cart
    }
    async removeProductFromCart(productId: Types.ObjectId, user: UserDocument) {

        // const { productId } = body

        const product = await this.productRepo.findOne({
            filter: {
                _id: productId,
            }
        })
        if (!product) {
            throw new BadRequestException("product not found")
        }
        const cart = await this.cartRepo.findOne({
            filter: {
                createdBy: user._id,
                // products: { $elemMatch: { productId } } // more than one condition
                "products.productId": new Types.ObjectId(productId) // one condition pass as object id
            }
        })
        if (!cart) {
            throw new BadRequestException("Cart not exist")
        }
        cart.products = cart.products.filter(
            (p) => p.productId.toString() !== productId.toString()
        )


        await cart.save()
        return cart
    }
    async updateProductQuantity(body: updateProductQuantityDto, user: UserDocument) {

        const { productId, quantity } = body

        const cart = await this.cartRepo.findOne({
            filter: {
                createdBy: user._id,
                // products: { $elemMatch: { productId } } // more than one condition
                "products.productId": new Types.ObjectId(productId) // one condition pass as object id
            }
        })
        if (!cart) {
            throw new BadRequestException("Cart not exist")
        }
        cart.products.find(
            (p) => {
                if (p.productId.toString() == productId.toString()) {
                    p.quantity += quantity
                    return p
                }
            }
        )


        await cart.save()
        return cart
    }





}
