import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return films list', async () => {
    const result = { total: 0, items: [] };

    filmsServiceMock.findAll.mockResolvedValue(result);

    await expect(controller.findAll()).resolves.toEqual(result);
    expect(filmsServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return film schedule', async () => {
    const filmId = 'film-id';
    const result = { total: 0, items: [] };

    filmsServiceMock.findSchedule.mockResolvedValue(result);

    await expect(controller.findSchedule(filmId)).resolves.toEqual(result);
    expect(filmsServiceMock.findSchedule).toHaveBeenCalledWith(filmId);
  });
});
