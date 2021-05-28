import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { pgProviders } from './pg/pg.providers';
import { DatabaseService } from './database.service';

@Module({
  providers: [...databaseProviders, ...pgProviders, DatabaseService],
  exports: [DatabaseService, ...databaseProviders],
})
export class DatabaseModule {}
