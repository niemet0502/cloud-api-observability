import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'ORD-001' })
  customerId: string;

  @ApiProperty({ example: 99.99 })
  valueEur: number;

  @ApiProperty({ example: 'Widget A', required: false })
  description?: string;

  @ApiProperty({ example: '2025-03-01T12:00:00.000Z' })
  createdAt: string;
}
