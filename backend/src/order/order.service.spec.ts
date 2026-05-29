import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { RepositoryService } from '../repository/repository.service';

describe('OrderService', () => {
  let service: OrderService;

  const repositoryServiceMock = {
    reserveSeats: jest.fn(),
  };

  const createOrderDto = {
    email: 'test@test.com',
    phone: '+79990000000',
    tickets: [
      {
        film: 'film-id',
        session: 'session-id',
        daytime: '2026-05-28T10:00:00.000Z',
        row: 1,
        seat: 2,
        price: 350,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: RepositoryService,
          useValue: repositoryServiceMock,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create order and reserve seats', async () => {
    repositoryServiceMock.reserveSeats.mockResolvedValue(undefined);

    await expect(service.create(createOrderDto)).resolves.toEqual({
      total: 1,
      items: [
        {
          ...createOrderDto.tickets[0],
          id: 'ticket-1',
        },
      ],
    });

    expect(repositoryServiceMock.reserveSeats).toHaveBeenCalledWith(
      createOrderDto.tickets,
    );
  });

  it('should throw BadRequestException if reservation failed', async () => {
    repositoryServiceMock.reserveSeats.mockRejectedValue(
      new Error('Seat already taken'),
    );

    await expect(service.create(createOrderDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
