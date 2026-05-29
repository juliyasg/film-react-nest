import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { RepositoryService } from '../repository/repository.service';

describe('FilmsService', () => {
  let service: FilmsService;

  const repositoryServiceMock = {
    getFilms: jest.fn(),
    getSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: RepositoryService,
          useValue: repositoryServiceMock,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return films from repository', async () => {
    const result = { total: 0, items: [] };

    repositoryServiceMock.getFilms.mockResolvedValue(result);

    await expect(service.findAll()).resolves.toEqual(result);
    expect(repositoryServiceMock.getFilms).toHaveBeenCalled();
  });

  it('should return schedule from repository', async () => {
    const filmId = 'film-id';
    const result = { total: 0, items: [] };

    repositoryServiceMock.getSchedule.mockResolvedValue(result);

    await expect(service.findSchedule(filmId)).resolves.toEqual(result);
    expect(repositoryServiceMock.getSchedule).toHaveBeenCalledWith(filmId);
  });
});
