import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricsService } from '../metrics/metrics.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly metrics: MetricsService,
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    try {
      const order = this.ordersRepo.create({
        customerId: dto.customerId,
        valueEur: dto.valueEur,
        description: dto.description,
      });
      await this.ordersRepo.save(order);

      this.metrics.ordersCreatedTotal.inc({ status: 'success' });
      this.metrics.orderValueEur.observe({ status: 'success' }, dto.valueEur);

      return order;
    } catch (error) {
      this.metrics.ordersCreatedTotal.inc({ status: 'failed' });
      throw error;
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepo.find();
  }
}
