import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricsService } from '../metrics/metrics.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly metrics: MetricsService,
    @InjectRepository(Payment) private readonly paymentsRepo: Repository<Payment>,
  ) {}

  async process(dto: CreatePaymentDto): Promise<Payment> {
    const status = this.simulateStatus();
    const payment = this.paymentsRepo.create({
      orderId: dto.orderId,
      amountEur: dto.amountEur,
      method: dto.method,
      status,
    });
    await this.paymentsRepo.save(payment);

    this.metrics.paymentsProcessedTotal.inc({ status });
    this.metrics.paymentAmountEur.observe({ status }, dto.amountEur);

    return payment;
  }

  async findOne(id: string): Promise<Payment | null> {
    return this.paymentsRepo.findOneBy({ id });
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepo.find();
  }

  private simulateStatus(): PaymentStatus {
    const r = Math.random();
    if (r < 0.85) return 'success';
    if (r < 0.95) return 'declined';
    return 'error';
  }
}
