import { HttpStatus, applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { MemberGetSerialization } from '../serializations/user.get.serialization';

export function MemberCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc('member.create', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.CREATED,
                serialization: MemberGetSerialization
            },
        })
    );
}