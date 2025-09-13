import { CategoryRepository } from './../repository/repositories/category.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseGetTotalOptions,
    IDatabaseOptions,
} from 'src/common/database/interfaces/database.interface';
import { ENUM_CATEGORY_STATUS } from 'src/modules/categories/constants/category.enum';
import { CategoryCreateRequestDto } from 'src/modules/categories/dtos/request/category.create.request.dto';
import { CategoryUpdateRequestDto } from 'src/modules/categories/dtos/request/category.update.request.dto';
import { ENUM_CATEGORY_STATUS_CODE_ERROR } from 'src/modules/categories/enums/category.status-code.enum';
import {
    CategoryDoc,
    CategoryEntity,
} from 'src/modules/categories/repository/entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async create(
        { name, order }: CategoryCreateRequestDto,
        options?: IDatabaseCreateOptions
    ) {
        const createCategory: CategoryEntity = new CategoryEntity();
        createCategory.name = name;
        if (order != null) {
            createCategory.order = order;
        }
        await this.categoryRepository.create<CategoryEntity>(
            createCategory,
            options
        );
    }

    async update(
        category: string,
        data: CategoryUpdateRequestDto
    ): Promise<void> {
        const categoryDetails: CategoryDoc =
            await this.categoryRepository.findOneById(category);
        if (!categoryDetails) {
            throw new NotFoundException({
                statusCode: ENUM_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
                message: 'category.error.notFound',
            });
        }
        categoryDetails.name = data.name;
        categoryDetails.order = data.order ?? categoryDetails.order;
        await this.categoryRepository.save(categoryDetails);
    }

    async changeStatus(
        categoryDetails: CategoryDoc,
        status: ENUM_CATEGORY_STATUS
    ): Promise<void> {
        categoryDetails.status = status;
        await this.categoryRepository.save(categoryDetails);
    }

    async findOneById(id: string): Promise<CategoryDoc> {
        return this.categoryRepository.findOneById(id);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<CategoryDoc> {
        return this.categoryRepository.findOne(find, options);
    }

    async findAll(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<CategoryDoc[]> {
        return this.categoryRepository.findAll(find, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.categoryRepository.getTotal(find, options);
    }

    async exists(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<boolean> {
        return this.categoryRepository.exists(find, options);
    }
}
