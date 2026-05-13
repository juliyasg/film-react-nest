import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findSchedule(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.filmsService.findSchedule(id);
  }
}
