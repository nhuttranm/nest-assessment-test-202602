import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import appConfig from './config/app.config';
import { AppDataSource, typeOrmConfig } from './config/typeorm.config';
import { PairsService } from './services/pairs.service';
import { PairsController } from './controllers/pairs.controller';
import { UserPair } from './entities/user-pair.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature([UserPair]),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: 300, // 5 minutes
        store: redisStore,
        host: configService.get('app.redis.host'),
        port: configService.get('app.redis.port'),
        password: configService.get('app.redis.password'),
        db: configService.get('app.redis.dbIndex'),
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PairsController],
  providers: [PairsService],
})
export class AppModule {}