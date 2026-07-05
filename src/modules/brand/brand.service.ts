import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createBrandDto, QueryDto, updateBrandDto } from './brand.dto';
import { type UserDocument } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repo/brand.repo';
import { S3Service } from 'src/common/services/s3.service';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {


    constructor(
        private readonly brandRepo: BrandRepository,
        private readonly s3Service: S3Service
    ) { }


    async createBrand(body: createBrandDto, file: Express.Multer.File, user: UserDocument) {
        const { name, slogan } = body;


        if (await this.brandRepo.findOne({ filter: { name } })) {
            throw new ConflictException('Brand already exists');
        }

        const url = await this.s3Service.uploadFile({ file, path: "brand" });

        const brand = await this.brandRepo.create({
            name,
            slogan,
            logo: url,
            createdBy: user._id
        })

        if (!brand) {
            await this.s3Service.deleteFiles([url])
            throw new BadGatewayException('Failed to create brand');
        }

        return brand;
    }

    // update brand

    async updateBrand(body: updateBrandDto, id: Types.ObjectId, user: UserDocument) {

        const { name, slogan } = body

        const brand = await this.brandRepo.findOne({ filter: { _id: id } })

        if (!brand) {
            throw new ConflictException('Brand not found');
        }

        if (name && name === brand.name) {
            throw new ConflictException('Brand not change make change in name');
        }

        if (name && await this.brandRepo.findOne({ filter: { name } })) {
            throw new ConflictException('Brand name already exists');
        }

        await this.brandRepo.update(
            { _id: id },
            {
                name: name ?? brand.name,
                slogan: slogan ?? brand.slogan,
                updatedBy: user._id,
            },
        );

    }

    async getAllBrands(query: QueryDto) {
        const { page, limit, search } = query
        const brands = await this.brandRepo.paginate({
            page, limit, search: search ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { slogan: { $regex: search, $options: 'i' } }
                ]
            } : {}
        })
        return brands;
    }
    async getBrandById(id: Types.ObjectId) {
        const brand = await this.brandRepo.findOne({ filter: { _id: id } })
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }
        return brand;
    }
    async deleteBrand(id: Types.ObjectId) {
        const brand = await this.brandRepo.findOne({ filter: { _id: id } })
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }
        await this.brandRepo.delete(brand._id)
    }






    // delete brand
    // get brand
    // get all brands

}
