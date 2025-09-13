import { Request } from 'express';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { ResponsePagingMetadataPaginationDto } from 'src/common/response/dtos/response.paging.dto';

export interface IRequestApp<T = AuthJwtAccessPayloadDto> extends Request {
    user?: T;

    __language: string;
    __version: string;

    __pagination?: ResponsePagingMetadataPaginationDto;
}
