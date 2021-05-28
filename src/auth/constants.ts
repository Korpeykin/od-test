import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
  secret: () => {
    const config = new ConfigService();
    return config.get('JWT_SECRET');
  },
};
