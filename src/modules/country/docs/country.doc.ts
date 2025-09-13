import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/enums/doc.enum';
import { CountrySuggestRequestDto } from 'src/modules/country/dtos/request/country.suggest.request.dto';

export function SuggestCountryDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'suggest country',
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            dto: CountrySuggestRequestDto,
        }),
        DocResponse('country.suggest', {
            httpStatus: HttpStatus.NO_CONTENT,
        })
    );
}
