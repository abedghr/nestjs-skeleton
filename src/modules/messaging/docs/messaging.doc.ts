import { applyDecorators } from "@nestjs/common";
import { Doc, DocAuth, DocResponse, DocResponsePaging } from "src/common/doc/decorators/doc.decorator";
import { ConversationListResponseDto } from "../dtos/response/conversation.list.response.dto";
import { ConversationGetResponseDto } from "../dtos/response/conversation.get.response.dto";
import { MessageListResponseDto } from "../dtos/response/message.list.response.dto";

export function UserConversationsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get all of conversations',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocResponsePaging<ConversationListResponseDto>('conversation.list', {
            dto: ConversationListResponseDto,
        })
    );
}

export function ConversationAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'create conversation',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocResponse('conversation.create', {
            dto: ConversationGetResponseDto,
        })
    );
}

export function ConversationAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get conversation',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocResponse('conversation.get', {
            dto: ConversationGetResponseDto,
        })
    );
}

export function ConversationAdminGetMessagesDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get conversation messages',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocResponsePaging<MessageListResponseDto>('messaging.message.list', {
            dto: MessageListResponseDto,
        })
    );
}

export function ConversationAdminSendMessageDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'send message',
        }),
        DocAuth({
            jwtAccessToken: true,
        })       
    );
}
