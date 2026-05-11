import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument } from '../films/schema/film.schema';
import { TicketDto } from '../order/dto/order.dto';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectModel(Film.name)
    private filmModel: Model<FilmDocument>,
  ) {}

  async getFilms() {
    const items = await this.filmModel.find().lean();

    return {
      total: items.length,
      items,
    };
  }

  async getSchedule(filmId: string) {
    const film = await this.filmModel.findOne({ id: filmId }).lean();

    return {
      total: film?.schedule.length || 0,
      items: film?.schedule || [],
    };
  }

  async reserveSeats(tickets: TicketDto[]) {
    for (const ticket of tickets) {
      const film = await this.filmModel.findOne({
        id: ticket.film,
      });

      if (!film) {
        throw new BadRequestException('Film not found');
      }

      const session = film.schedule.find((item) => item.id === ticket.session);

      if (!session) {
        throw new BadRequestException('Session not found');
      }

      const place = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(place)) {
        throw new BadRequestException(`Seat ${place} already taken`);
      }

      session.taken.push(place);

      await film.save();
    }
  }
}
