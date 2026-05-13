import { IsArray, IsNumber, IsString } from 'class-validator';

export class FilmDto {
  @IsString()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  director: string;

  @IsArray()
  tags: string[];

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  cover: string;
}

export class ScheduleDto {
  @IsString()
  id: string;

  @IsString()
  daytime: string;

  @IsNumber()
  hall: number;

  @IsNumber()
  rows: number;

  @IsNumber()
  seats: number;

  @IsNumber()
  price: number;

  @IsArray()
  taken: string[];
}

export class FilmsResponseDto {
  @IsNumber()
  total: number;

  @IsArray()
  items: FilmDto[];
}

export class ScheduleResponseDto {
  @IsNumber()
  total: number;

  @IsArray()
  items: ScheduleDto[];
}
