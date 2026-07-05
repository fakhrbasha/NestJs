import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createCategoryDto, QueryDto } from './category.dto';
import { type UserDocument } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repo/brand.repo';
import { S3Service } from 'src/common/services/s3.service';
import { Types } from 'mongoose';
import CategoryRepository from 'src/DB/repo/category.repo';

@Injectable()
export class CategoryService {


    constructor(
        private readonly brandRepo: BrandRepository,
        private readonly categoryRepo: CategoryRepository,
        private readonly s3Service: S3Service
    ) { }


    async createCategory(body: createCategoryDto, file: Express.Multer.File, user: UserDocument) {

        const { name, brands } = body;


        if (await this.categoryRepo.findOne({ filter: { name } })) {
            throw new ConflictException('Category already exists');
        }

        const strictIds = [... new Set((brands || []).map(id => Types.ObjectId.createFromHexString(id.toString())))]

        if (brands && (await this.brandRepo.find({ filter: { _id: { $in: strictIds } } })).length !== strictIds.length) {
            throw new NotFoundException('Some of brands not found');
        }

        const image = await this.s3Service.uploadFile({ file, path: "category" });

        const category = await this.categoryRepo.create({
            name,
            brands: strictIds,
            logo: image,
            createdBy: user._id
        })

        return category;
    }

    async getAllCategories(query: QueryDto) {

        const { page, limit, search } = query
        const category = await this.categoryRepo.paginate({
            page, limit, search: search ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { slogan: { $regex: search, $options: 'i' } }
                ]
            } : {}
        })
        return category;

    }

    async getCategoryById(id: Types.ObjectId) {
        const category = await this.categoryRepo.findOne({ filter: { _id: id } })
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;

    }
    async deleteCategory(id: Types.ObjectId) {
        const category = await this.categoryRepo.findOne({ filter: { _id: id } })
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return this.categoryRepo.delete(category._id)

    }

    async updateCategory(body: createCategoryDto, id: Types.ObjectId, user: UserDocument) {
        const { name, brands } = body;

        const category = await this.categoryRepo.findOne({ filter: { _id: id } });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (name && name !== category.name) {
            ;
            if (await this.categoryRepo.findOne({ filter: { name } })) {
                throw new ConflictException('Category name already exists');
            }
        }

        let strictIds: Types.ObjectId[] | undefined;

        if (brands) {
            strictIds = [
                ...new Set(
                    brands.map(id =>
                        Types.ObjectId.createFromHexString(id.toString())
                    )
                ),
            ];

            const foundedBrands = await this.brandRepo.find({
                filter: { _id: { $in: strictIds } },
            });

            if (foundedBrands.length !== strictIds.length) {
                throw new NotFoundException('Some brands not found');
            }
        }

        const updateData: any = {};

        if (name) updateData.name = name;
        if (brands) updateData.brands = strictIds;

        const updatedCategory = await this.categoryRepo.update(
            { _id: id },
            {
                ...updateData,
                updatedBy: user._id,
            }
        );

        return updatedCategory;

    }



}
