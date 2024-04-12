import { Injectable } from '@nestjs/common';
import bytes from 'bytes';

@Injectable()
export class HelperFileService {
    convertToBytes(megabytes: string): number {
        return bytes(megabytes);
    }
}
