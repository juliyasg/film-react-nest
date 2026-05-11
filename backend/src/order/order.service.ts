import { Injectable } from '@nestjs/common';

import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class OrderService {
  constructor(private readonly repositoryService: RepositoryService) {}

  async create(orderDto: CreateOrderDto): Promise<OrderResponseDto> {
    await this.repositoryService.reserveSeats(orderDto.tickets);

    return {
      total: orderDto.tickets.length,
      items: orderDto.tickets.map((ticket, index) => ({
        ...ticket,
        id: `ticket-${index + 1}`,
      })),
    };
  }
}
