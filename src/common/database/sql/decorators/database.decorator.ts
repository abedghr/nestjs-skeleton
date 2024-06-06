import { InjectRepository } from '@nestjs/typeorm';

export function DatabaseModel(
    entity: any,
): ParameterDecorator {
    return InjectRepository(entity)
}
