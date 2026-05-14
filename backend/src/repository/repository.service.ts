import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from '../films/entity/film.entity';
import { Schedule } from '../films/entity/schedule.entity';

import { TicketDto } from '../order/dto/order.dto';

import { FilmsRepository } from './films.repository';

@Injectable()
export class RepositoryService implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async getFilms() {
    const items = await this.filmRepository.find({
      relations: {
        schedule: true,
      },
    });

    return {
      total: items.length,

      items: items.map((film) => ({
        ...film,

        tags: film.tags.split(','),
      })),
    };
  }

  async getSchedule(filmId: string) {
    const film = await this.filmRepository.findOne({
      where: {
        id: filmId,
      },

      relations: {
        schedule: true,
      },
    });

    return {
      total: film?.schedule.length || 0,

      items:
        film?.schedule
          .sort(
            (a, b) =>
              new Date(a.daytime).getTime() - new Date(b.daytime).getTime(),
          )
          .map((schedule) => ({
            ...schedule,

            taken: schedule.taken ? schedule.taken.split(',') : [],
          })) || [],
    };
  }

  async reserveSeats(tickets: TicketDto[]) {
    for (const ticket of tickets) {
      const session = await this.scheduleRepository.findOne({
        where: {
          id: ticket.session,
        },
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const taken = session.taken ? session.taken.split(',') : [];

      const place = `${ticket.row}:${ticket.seat}`;

      if (taken.includes(place)) {
        throw new Error(`Seat ${place} already taken`);
      }

      taken.push(place);

      session.taken = taken.join(',');

      await this.scheduleRepository.save(session);
    }
  }
}
