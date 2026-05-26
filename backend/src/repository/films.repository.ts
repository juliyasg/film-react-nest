import { FilmsResponseDto, ScheduleResponseDto } from '../films/dto/films.dto';

import { TicketDto } from '../order/dto/order.dto';

export interface FilmsRepository {
  getFilms(): Promise<FilmsResponseDto>;

  getSchedule(filmId: string): Promise<ScheduleResponseDto>;

  reserveSeats(tickets: TicketDto[]): Promise<void>;
}
