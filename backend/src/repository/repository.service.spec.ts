import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryService } from './repository.service';
import { Film } from '../films/entity/film.entity';
import { Schedule } from '../films/entity/schedule.entity';

describe('RepositoryService', () => {
  let service: RepositoryService;

  const filmRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const scheduleRepositoryMock = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryService,
        {
          provide: getRepositoryToken(Film),
          useValue: filmRepositoryMock,
        },
        {
          provide: getRepositoryToken(Schedule),
          useValue: scheduleRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<RepositoryService>(RepositoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return films', async () => {
    const films = [
      {
        id: 'film-id',
        title: 'Film',
        tags: ['drama'],
        schedule: [],
      },
    ];

    filmRepositoryMock.find.mockResolvedValue(films);

    await expect(service.getFilms()).resolves.toEqual({
      total: 1,
      items: films,
    });

    expect(filmRepositoryMock.find).toHaveBeenCalledWith({
      relations: {
        schedule: true,
      },
    });
  });

  it('should return sorted schedule', async () => {
    const film = {
      id: 'film-id',
      schedule: [
        {
          id: 'late-session',
          daytime: '2026-05-28T20:00:00.000Z',
          taken: null,
        },
        {
          id: 'early-session',
          daytime: '2026-05-28T10:00:00.000Z',
          taken: ['1:1'],
        },
      ],
    };

    filmRepositoryMock.findOne.mockResolvedValue(film);

    await expect(service.getSchedule('film-id')).resolves.toEqual({
      total: 2,
      items: [
        {
          id: 'early-session',
          daytime: '2026-05-28T10:00:00.000Z',
          taken: ['1:1'],
        },
        {
          id: 'late-session',
          daytime: '2026-05-28T20:00:00.000Z',
          taken: [],
        },
      ],
    });
  });

  it('should reserve seats', async () => {
    const session = {
      id: 'session-id',
      taken: [],
    };

    scheduleRepositoryMock.findOne.mockResolvedValue(session);
    scheduleRepositoryMock.save.mockResolvedValue(session);

    await service.reserveSeats([
      {
        film: 'film-id',
        session: 'session-id',
        daytime: '2026-05-28T10:00:00.000Z',
        row: 1,
        seat: 2,
        price: 350,
      },
    ]);

    expect(session.taken).toEqual(['1:2']);
    expect(scheduleRepositoryMock.save).toHaveBeenCalledWith(session);
  });

  it('should throw error if session was not found', async () => {
    scheduleRepositoryMock.findOne.mockResolvedValue(null);

    await expect(
      service.reserveSeats([
        {
          film: 'film-id',
          session: 'session-id',
          daytime: '2026-05-28T10:00:00.000Z',
          row: 1,
          seat: 2,
          price: 350,
        },
      ]),
    ).rejects.toThrow('Session not found');
  });

  it('should throw error if seat is already taken', async () => {
    const session = {
      id: 'session-id',
      taken: ['1:2'],
    };

    scheduleRepositoryMock.findOne.mockResolvedValue(session);

    await expect(
      service.reserveSeats([
        {
          film: 'film-id',
          session: 'session-id',
          daytime: '2026-05-28T10:00:00.000Z',
          row: 1,
          seat: 2,
          price: 350,
        },
      ]),
    ).rejects.toThrow('Seat 1:2 already taken');
  });
});
