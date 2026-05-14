import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  inject: [ConfigService],

  provide: 'CONFIG',

  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') || '',

      url: configService.get<string>('DATABASE_URL') || '',

      username: configService.get<string>('DATABASE_USERNAME') || '',

      password: configService.get<string>('DATABASE_PASSWORD') || '',
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;

  url: string;

  username: string;

  password: string;
}
