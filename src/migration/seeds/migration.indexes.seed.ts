import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserDoc } from 'src/modules/user/repositories/entities/user.entity';

@Injectable()
export class MigrationIndexesSeed {
    constructor(
        private readonly userDoc: UserDoc,
    ) {}

    @Command({
        command: 'remove:indexes',
        describe: 'remove indexes',
    })
    async remove(): Promise<void> {
        try {
            await Promise.all([
                this.userDoc.collection.dropIndexes(),
            ]);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
