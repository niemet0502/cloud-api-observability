import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'ORD-001' })
  orderId: string;

  @ApiProperty({ example: 99.99 })
  amountEur: number;

  @ApiProperty({ example: 'card', required: false })
  method?: string;

  @ApiProperty({ example: 'success', enum: ['success', 'declined', 'error'] })
  status: 'success' | 'declined' | 'error';

  @ApiProperty({ example: '2025-03-01T12:00:00.000Z' })
  processedAt: string;
}
