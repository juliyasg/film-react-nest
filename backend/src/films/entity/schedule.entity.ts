import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column('float')
  price: number;

  @Column('text', { array: true })
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedule)
  film: Film;
}
