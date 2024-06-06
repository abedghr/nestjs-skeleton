import {
  BadRequestException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MemberEntity } from '../repositories/entities/member.sql.entity';
import { MemberRepository } from '../repositories/repositories/member.repository';
import { MemberCreateDto } from '../dtos/member.create.dto';

@Injectable()
export class MemberService {
  constructor(
    private memberRepository: MemberRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(
    {
      email,
      firstName,
      lastName,
      gender,
    }: MemberCreateDto,
  ): Promise<MemberEntity> {
    const emailExists: MemberEntity = await this.memberRepository.findOne({ where: { email } });

    if (emailExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.emailExists',
      });
    }

    return this.memberRepository.create({
      email,
      firstName,
      lastName,
      gender
    });
  }
}
