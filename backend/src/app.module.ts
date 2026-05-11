import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';

import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { Film, FilmSchema } from './films/schema/film.schema';

import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

import { RepositoryService } from './repository/repository.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    MongooseModule.forRoot(process.env.DATABASE_URL),

    MongooseModule.forFeature([
      {
        name: Film.name,
        schema: FilmSchema,
      },
    ]),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'),
      serveRoot: '/content',
    }),
  ],

  controllers: [FilmsController, OrderController],

  providers: [configProvider, FilmsService, OrderService, RepositoryService],
})
export class AppModule {}
