import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsModule } from './metrics/metrics.module';
import { Order } from './orders/order.entity';
import { OrdersModule } from './orders/orders.module';
import { Payment } from './payments/payment.entity';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        port: parseInt(config.get<string>('POSTGRES_PORT', '5432'), 10),
        username: config.get<string>('POSTGRES_USER', 'metrics'),
        password: config.get<string>('POSTGRES_PASSWORD', 'metrics'),
        database: config.get<string>('POSTGRES_DB', 'metrics'),
        entities: [Order, Payment],
        synchronize: true,
      }),
    }),
    MetricsModule,
    OrdersModule,
    PaymentsModule,
  ],
})
export class AppModule {}
