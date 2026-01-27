import { Module, Global } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

// @Global() makes this module available to all other modules without importing it again
@Global()
@Module({
  providers: [{
    provide: 'REDIS_CLIENT',
    useFactory: async (configService: ConfigService) => {
      // Usamos getOrThrow para que la app falle explícitamente si falta la variable
      const url = configService.getOrThrow<string>('REDIS_URL');
      return new Redis(url)
    },
    inject: [ConfigService],
  },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})



export class RedisModule { }
