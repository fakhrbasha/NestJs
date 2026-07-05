import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createProductDto, QueryDto } from './product.dto';
import { type UserDocument } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repo/brand.repo';
import { S3Service } from 'src/common/services/s3.service';
import { Types } from 'mongoose';
import CategoryRepository from 'src/DB/repo/category.repo';
import ProductRepository from 'src/DB/repo/product.repo';

@Injectable()
export class ProductService {


    constructor(
        private readonly brandRepo: BrandRepository,
        private readonly categoryRepo: CategoryRepository,
        private readonly productRepo: ProductRepository,
        private readonly s3Service: S3Service
    ) { }


    async createProduct(body: createProductDto, files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] }, user: UserDocument) {

        let { name, brandId, categoryId, description, price, stock, discount } = body

        if (await this.categoryRepo.findOne({ filter: { _id: categoryId } })) {
            throw new NotFoundException('Some of categories not found');
        }
        if (await this.brandRepo.findOne({ filter: { _id: brandId } })) {
            throw new NotFoundException('Some of brands not found');
        }

        price = price! - (price! * ((discount || 0) / 100))


        const mainImage = await this.s3Service.uploadFile({ file: files.mainImage[0], path: "product/mainImage" });

        let subImages: string[] = [];
        if (files.subImages.length > 0) {
            subImages = await this.s3Service.uploadFiles({ files: files.subImages, path: "product/subImages" });

        }

        const product = await this.productRepo.create({
            name,
            description,
            brandId: [brandId],
            categoryId: [categoryId],
            mainImage,
            subImages: subImages || [],
            price,
            stock,
            discount,
            createdBy: user._id
        })

        if (!product) {
            await this.s3Service.deleteFiles([mainImage, ...subImages])
            throw new BadGatewayException('Failed to create product');
        }

        return product;


    }




    // delete brand
    // get brand
    // get all brands

}
