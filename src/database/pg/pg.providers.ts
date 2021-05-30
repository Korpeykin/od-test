import { Tag } from './tag.entity';
import { Users } from './users.entity';
import { UserTags } from './user-tag.entity';

export const pgProviders = [
  {
    provide: 'PG_USERS_REPOSITORY',
    useValue: Users,
  },
  {
    provide: 'PG_TAG_REPOSITORY',
    useValue: Tag,
  },
  {
    provide: 'PG_USER_TAG_REPOSITORY',
    useValue: UserTags,
  },
];
