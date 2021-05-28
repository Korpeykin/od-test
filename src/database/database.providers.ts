import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Tag } from './pg/tag.entity';
import { Users } from './pg/users.entity';

export const databaseProviders = [
  {
    provide: 'PGSQL',
    useFactory: async (config: ConfigService) => {
      const sequelizePg = new Sequelize({
        dialect: 'postgres',
        host: config.get<string>('PG_HOST'),
        port: config.get<number>('PG_PORT'),
        username: config.get<string>('PG_USERNAME'),
        password: config.get<string>('PG_PASSWORD'),
        database: config.get<string>('PG_DATABASE'),
        logging: false,
      });
      sequelizePg.addModels([Users, Tag]);
      await sequelizePg.sync();
      return sequelizePg;
    },
    inject: [ConfigService],
  },
];
