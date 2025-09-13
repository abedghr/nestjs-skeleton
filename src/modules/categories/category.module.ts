import { Module } from '@nestjs/common';
import { CategoryRepositoryModule } from 'src/modules/categories/repository/category.repository.module';
import { CategoryService } from 'src/modules/categories/services/category.service';
import { CountryModule } from 'src/modules/country/country.module';

@Module({
    imports: [CategoryRepositoryModule, CountryModule],
    exports: [CategoryService],
    providers: [CategoryService],
    controllers: [],
})
export class CategoryModule {}
