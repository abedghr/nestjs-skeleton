import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import {
    REQUEST_PARAM_CLASS_DTOS_META_KEY,
} from 'src/common/request/constants/request.constant';
import { RequestParamRawGuard } from 'src/common/request/guards/request.param.guard';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

export const RequestCustomLang: () => ParameterDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext): string[] => {
        const { __customLang } = ctx.switchToHttp().getRequest<IRequestApp>();
        return __customLang;
    }
);

export function RequestParamGuard(
    ...classValidation: ClassConstructor<any>[]
): MethodDecorator {
    return applyDecorators(
        UseGuards(RequestParamRawGuard),
        SetMetadata(REQUEST_PARAM_CLASS_DTOS_META_KEY, classValidation)
    );
}
