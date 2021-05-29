import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { pgProviders } from 'src/database/pg/pg.providers';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [TagsService, ...pgProviders],
  controllers: [TagsController],
})
export class TagsModule {}
