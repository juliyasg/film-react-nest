import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';

import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';

import { Film } from './films/entity/film.entity';
import { Schedule } from './films/entity/schedule.entity';

import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

import { RepositoryService } from './repository/repository.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('DATABASE_DRIVER'),

        host: configService.get<string>('DATABASE_HOST'),

        port: Number(configService.get<string>('DATABASE_PORT')),

        database: configService.get<string>('DATABASE_NAME'),

        username: configService.get<string>('DATABASE_USERNAME'),

        password: configService.get<string>('DATABASE_PASSWORD'),

        entities: [Film, Schedule],

        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature([Film, Schedule]),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'),
      serveRoot: '/content',
    }),
  ],

  controllers: [FilmsController, OrderController],

  providers: [configProvider, FilmsService, OrderService, RepositoryService],
})
export class AppModule {}
