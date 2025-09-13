import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CategoryGetRequestDto {
    @ApiProperty({
        example: faker.string.uuid(),
    })
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    category: string;
}
