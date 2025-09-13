import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthJwtAccessStrategy } from './guards/jwt/strategies/auth.jwt.access.strategy';
import { AuthJwtRefreshStrategy } from './guards/jwt/strategies/auth.jwt.refresh.strategy';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';

@Module({
    providers: [AuthService],
    exports: [AuthService],
    controllers: [],
    imports: [UserModule, ConfigModule],
})
export class AuthModule {
    static forRoot(): DynamicModule {
        return {
            module: AuthModule,
            providers: [AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}
