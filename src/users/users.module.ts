import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { pgProviders } from 'src/database/pg/pg.providers';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [UsersService, ...pgProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
