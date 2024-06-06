import { Module } from '@nestjs/common';
import { DatabaseOptionsService } from './mongo/services/database.options.service';
import { DatabaseSQLOptionsService } from './sql/services/database-sql.options.service';

@Module({
  providers: [DatabaseOptionsService, DatabaseSQLOptionsService],
  exports: [DatabaseOptionsService, DatabaseSQLOptionsService],
  imports: [],
  controllers: [],
})
export class DatabaseOptionsModule {}