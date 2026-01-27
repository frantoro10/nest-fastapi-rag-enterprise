import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // Configuration module - Load .env file (Carga archivo env, modulo de configuracion)
    ConfigModule.forRoot({
      isGlobal: true, // To use the variables everywhere
    }),

    // Database module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true, // Carga automaticamente las entidades - Load entities automatically
        synchronize: false, // En producción es false. - In production is false
        ssl: {
          rejectUnauthorized: false, // For safe conection to Supabase
        },
      }),
    }),

    DocumentsModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


