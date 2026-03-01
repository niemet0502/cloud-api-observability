import { Injectable } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;

  // Business/domain metrics
  readonly ordersCreatedTotal: Counter;
  readonly paymentsProcessedTotal: Counter;
  readonly orderValueEur: Histogram;
  readonly paymentAmountEur: Histogram;

  // API-level HTTP metrics
  readonly apiRequestsTotal: Counter;
  readonly apiRequestsSuccessTotal: Counter;
  readonly apiRequestsFailedTotal: Counter;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry, prefix: 'metrics_' });

    this.ordersCreatedTotal = new Counter({
      name: 'orders_created_total',
      help: 'Total number of orders created',
      labelNames: ['status'],
      registers: [this.registry],
    });

    this.paymentsProcessedTotal = new Counter({
      name: 'payments_processed_total',
      help: 'Total number of payments processed',
      labelNames: ['status'],
      registers: [this.registry],
    });

    this.orderValueEur = new Histogram({
      name: 'order_value_eur',
      help: 'Order value in EUR',
      labelNames: ['status'],
      buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
      registers: [this.registry],
    });

    this.paymentAmountEur = new Histogram({
      name: 'payment_amount_eur',
      help: 'Payment amount in EUR',
      labelNames: ['status'],
      buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
      registers: [this.registry],
    });

    this.apiRequestsTotal = new Counter({
      name: 'api_requests_total',
      help: 'Total number of HTTP requests received by the API',
      labelNames: ['method', 'route'],
      registers: [this.registry],
    });

    this.apiRequestsSuccessTotal = new Counter({
      name: 'api_requests_success_total',
      help: 'Total number of successful HTTP responses',
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry],
    });

    this.apiRequestsFailedTotal = new Counter({
      name: 'api_requests_failed_total',
      help: 'Total number of failed HTTP responses',
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
