import { Injectable } from '@nestjs/common';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class FilmsService {
  constructor(private readonly repositoryService: RepositoryService) {}

  async findAll(): Promise<FilmsResponseDto> {
    return this.repositoryService.getFilms();
  }

  async findSchedule(id: string): Promise<ScheduleResponseDto> {
    return this.repositoryService.getSchedule(id);
  }
}
