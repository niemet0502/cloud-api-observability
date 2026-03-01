import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Process a payment' })
  @ApiResponse({ status: 201, description: 'Payment processed', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async process(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.process(dto);
    return this.toResponse(payment);
  }

  @Get()
  @ApiOperation({ summary: 'List all payments' })
  @ApiResponse({ status: 200, description: 'List of payments', type: [PaymentResponseDto] })
  async findAll(): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentsService.findAll();
    return payments.map((p) => this.toResponse(p));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment found', type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.findOne(id);
    if (!payment) throw new NotFoundException(`Payment ${id} not found`);
    return this.toResponse(payment);
  }

  private toResponse(
    payment: {
      id: string;
      orderId: string;
      amountEur: number;
      method?: string;
      status: 'success' | 'declined' | 'error';
      processedAt: Date;
    },
  ): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.orderId,
      amountEur: payment.amountEur,
      method: payment.method,
      status: payment.status,
      processedAt: payment.processedAt.toISOString(),
    };
  }
}
