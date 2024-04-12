import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import configs from './configs';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from './database/mongo/constants/database.constant';
import { DatabaseOptionsModule } from './database/database.options.module';
import { DatabaseOptionsService } from './database/services/database.options.service';
import { FileModule } from './file/file.module';
import { HelperModule } from './helper/helper.module';
import { PaginationModule } from './pagination/pagination.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';
import { MessageModule } from './message/message.module';
import { ErrorModule } from './error/error.module';
import { DebuggerModule } from './debugger/debugger.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        MongooseModule.forRootAsync({
            connectionName: DATABASE_CONNECTION_NAME,
            imports: [DatabaseOptionsModule],
            inject: [DatabaseOptionsService],
            useFactory: (databaseOptionsService: DatabaseOptionsService) =>
                databaseOptionsService.createOptions(),
        }),
        AuthModule,
        AwsModule,
        AuthModule,
        AwsModule,
        FileModule,
        HelperModule,
        PaginationModule,
        RequestModule,
        ResponseModule,
        MessageModule,
        ErrorModule,
        DebuggerModule.forRoot(),
    ],
})
export class CommonModule {}
