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
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: parseInt(config.get<string>('DATABASE_PORT', '5432'), 10),
        username: config.get<string>('DATABASE_USER', 'metrics'),
        password: config.get<string>('DATABASE_PASSWORD', 'metrics'),
        database: config.get<string>('DATABASE_NAME', 'metrics'),
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
