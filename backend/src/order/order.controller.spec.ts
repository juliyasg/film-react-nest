import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;

  const orderServiceMock = {
    create: jest.fn(),
  };

  const createOrderDto = {
    email: 'test@test.com',
    phone: '+79990000000',
    tickets: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create order', async () => {
    const result = { total: 0, items: [] };

    orderServiceMock.create.mockResolvedValue(result);

    await expect(controller.create(createOrderDto)).resolves.toEqual(result);
    expect(orderServiceMock.create).toHaveBeenCalledWith(createOrderDto);
  });
});
