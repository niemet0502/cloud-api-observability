import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.ordersService.create(dto);
    return this.toResponse(order);
  }

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'List of orders', type: [OrderResponseDto] })
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAll();
    return orders.map((o) => this.toResponse(o));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOne(id);
    return this.toResponse(order);
  }

  private toResponse(order: { id: string; customerId: string; valueEur: number; description?: string; createdAt: Date }): OrderResponseDto {
    return {
      id: order.id,
      customerId: order.customerId,
      valueEur: order.valueEur,
      description: order.description,
      createdAt: order.createdAt.toISOString(),
    };
  }
}
