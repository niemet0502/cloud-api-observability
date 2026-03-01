import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'ORD-001', description: 'Order or reference id' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 99.99, description: 'Payment amount in EUR', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amountEur: number;

  @ApiProperty({ example: 'card', description: 'Payment method', required: false })
  @IsOptional()
  @IsString()
  method?: string;
}
