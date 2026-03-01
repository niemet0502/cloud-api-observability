import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'ORD-001', description: 'Customer or reference id' })
  @IsString()
  customerId: string;

  @ApiProperty({ example: 99.99, description: 'Order total value in EUR', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  valueEur: number;

  @ApiProperty({ example: 'Widget A', description: 'Product or item description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
