import { Tag } from './tag.entity';
import { Users } from './users.entity';

export const pgProviders = [
  {
    provide: 'PG_USERS_REPOSITORY',
    useValue: Users,
  },
  {
    provide: 'PG_TAG_REPOSITORY',
    useValue: Tag,
  },
];
