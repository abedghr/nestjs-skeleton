import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDatabaseOptionsService } from 'src/common/database/mongo/interfaces/database.options-service.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as glob from 'glob';
import * as tsNode from 'ts-node';

@Injectable()
export class DatabaseSQLOptionsService implements IDatabaseOptionsService {
  constructor(private readonly configService: ConfigService) {}

  createOptions(): TypeOrmModuleOptions {
    const type = this.configService.get<string>('database.SQLtype') as 'postgres'|'mysql' ?? 'postgres';
    const host = this.configService.get<string>('database.SQLHost');
    const port = this.configService.get<string>('database.SQLPort');
    const database = this.configService.get<string>('database.SQLDatabase');
    const username = this.configService.get<string>('database.SQLUsername');
    const password = this.configService.get<string>('database.SQLPassword');

    // Register ts-node to handle TypeScript files
    tsNode.register();

    // Dynamically load all entity files with the pattern *.sql.entity.ts recursively within the src directory
    const entityFiles = glob.sync(path.resolve(__dirname, '../../../../modules/**/repositories/entities/*.sql.*.js'));

    // Import each entity file dynamically
    const entities = entityFiles.map(file => {
      const entityModule = require(file);
      // Extract all entities dynamically
      const extractedEntities = Object.values(entityModule);
      return extractedEntities;
    }).flat() as Function[]; // Use type assertion to specify the type as Function[]


    return {
      type,
      host,
      port: parseInt(port),
      username,
      password,
      database,
      entities,
      migrationsTableName: 'migration',
      migrations: [path.join(__dirname, '../../migration/*.ts')],
      synchronize: false
    }
  }
}
