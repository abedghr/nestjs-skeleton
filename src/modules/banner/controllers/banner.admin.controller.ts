import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthAdminJwtAccessProtected } from 'src/modules/auth/decorators/auth.jwt.decorator';
import {
    PaginationQuery,
    PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_ROLE_TYPE,
    ENUM_POLICY_SUBJECT,
} from 'src/modules/policy/enums/policy.enum';
import {
    PolicyAbilityProtected,
    PolicyRoleProtected,
} from 'src/modules/policy/decorators/policy.decorator';
import { RequestRequiredPipe } from 'src/common/request/pipes/request.required.pipe';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import {
    BANNER_DEFAULT_AVAILABLE_SEARCH,
    BANNER_DEFAULT_IS_ACTIVE,
} from 'src/modules/banner/constants/banner.list.constant';
import {
    BannerAdminGetDoc,
    BannerAdminListDoc,
} from 'src/modules/banner/docs/banner.admin.doc';
import { BannerParsePipe } from 'src/modules/banner/pipes/banner.parse.pipe';
import { BannerDoc } from 'src/modules/banner/repository/entities/banner.entity';
import { BannerService } from 'src/modules/banner/services/banner.service';
import { BannerCreateRequestDto } from 'src/modules/banner/dtos/request/banner.create.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannerListResponseDto } from 'src/modules/banner/dtos/response/banner.list.response.dto';

@ApiTags('modules.admin.banner')
@Controller({
    version: '1',
    path: '/banner',
})
export class BannerAdminController {
    constructor(
        private readonly bannerService: BannerService,
        private readonly paginationService: PaginationService
    ) {}

    @BannerAdminListDoc()
    @ResponsePaging('banner.list', {
        serialization: BannerListResponseDto,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.BANNER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery({
            availableSearch: BANNER_DEFAULT_AVAILABLE_SEARCH,
        })
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInBoolean('isActive', BANNER_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>
    ): Promise<IResponsePaging<BannerDoc>> {
        const find: Record<string, any> = {
            ..._search,
            ...isActive,
        };

        const banners: BannerDoc[] = await this.bannerService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
            join: true,
        });
        const total: number = await this.bannerService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: banners,
        };
    }

    @BannerAdminGetDoc()
    @Response('banner.get')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.BANNER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.PROVIDER)
    @AuthAdminJwtAccessProtected()
    @Get('/get/:banner')
    async get(
        @Param('banner', RequestRequiredPipe, BannerParsePipe)
        banner: BannerDoc
    ): Promise<IResponse<BannerDoc>> {
        return { data: banner };
    }

    @Post('/create')
    @Response('banner.create')
    @UseInterceptors(FileInterceptor('imageUrl'))
    @ApiConsumes('multipart/form-data')
    @AuthAdminJwtAccessProtected()
    async create(
        @Body() createBannerDto: BannerCreateRequestDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<IResponse<BannerDoc>> {
        const createdBanner = await this.bannerService.create(
            createBannerDto,
            file
        );

        return { data: createdBanner };
    }

    @Put('/update/:banner')
    @Response('banner.update')
    @AuthAdminJwtAccessProtected()
    async update(
        @Param('banner', RequestRequiredPipe, BannerParsePipe)
        banner: BannerDoc,
        @Body() updateBannerDto: BannerCreateRequestDto
    ): Promise<IResponse<BannerDoc>> {
        const updatedBanner = await this.bannerService.update(
            banner._id,
            updateBannerDto
        );

        return { data: updatedBanner };
    }
    @Response('banner.update')
    @AuthAdminJwtAccessProtected()
    @Delete('/delete/:bannerId')
    async delete(
        @Param('bannerId', RequestRequiredPipe) bannerId: string
    ): Promise<void> {
        try {
            await this.bannerService.delete({ _id: bannerId });
        } catch (err) {
            console.log(err);
        }
    }
}
