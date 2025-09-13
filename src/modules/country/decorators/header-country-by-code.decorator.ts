import {
    BadRequestException,
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export const HeaderCountryByCode = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const countryCode = request.headers['x-country-code'];

        if (!countryCode) {
            throw new BadRequestException(
                'Header "x-country-code" is missing.'
            );
        }

        return countryCode;
    }
);

export const HeaderUserLocation = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const countryCode = request.headers['x-country-code'];
        if (!countryCode) {
            throw new BadRequestException(
                'Header "x-country-code" is missing.'
            );
        }
        const longitude = request.headers['x-longitude'] ?? null;
        const latitude = request.headers['x-latitude'] ?? null;

        return { longitude, latitude, countryCode };
    }
);
