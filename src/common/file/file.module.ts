import { Global, Module } from '@nestjs/common';
import { FileHelperService } from './services/file.helper.service';

@Global()
@Module({
    providers: [
        FileHelperService,
    ],
    exports: [
        FileHelperService,
    ],
    controllers: [],
    imports: [],
})
export class FileModule {}
