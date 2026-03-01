import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpMetricsInterceptor } from './metrics/http-metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Log every incoming request
  app.use((req: import('express').Request, _res: import('express').Response, next: import('express').NextFunction) => {
    console.log(`→ ${req.method} ${req.originalUrl}`);
    next();
  });

  const httpMetricsInterceptor = app.get(HttpMetricsInterceptor);
  app.useGlobalInterceptors(httpMetricsInterceptor);

  const config = new DocumentBuilder()
    .setTitle('Metrics API')
    .setDescription('API for learning metrics, Prometheus and Grafana (orders & payments)')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
}
bootstrap();
