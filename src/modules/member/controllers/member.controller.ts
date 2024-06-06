import { MemberService } from './../services/member.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { MemberEntity } from '../repositories/entities/member.sql.entity';
import { MemberCreateDto } from '../dtos/member.create.dto';
import { MemberGetSerialization } from '../serializations/user.get.serialization';
import { MemberCreateDoc } from '../docs/member.doc';

@Controller('member')
export class MemberController {
    constructor(
        private readonly MemberService: MemberService,
      ) {}

    @MemberCreateDoc()
    @Response('member.create', {
      serialization: MemberGetSerialization,
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('/')
    async create(
      @Body() body: MemberCreateDto,
    ): Promise<IResponse> {
      
      const createdUser: MemberEntity = await this.MemberService.create(body);

      return {
        data: createdUser,
      };
    }

}
