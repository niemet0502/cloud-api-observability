import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const method = request.method;
    // Use the matched route path when available; fallback to url without query string
    const route =
      (request as any).route?.path ||
      (request.baseUrl || '') + (request.path || '');

    this.metrics.apiRequestsTotal.inc({ method, route });

    return next.handle().pipe(
      tap({
        next: () => {
          const status = String(response.statusCode);
          this.metrics.apiRequestsSuccessTotal.inc({ method, route, status });
        },
        error: (err: any) => {
          const status = String(err?.status ?? err?.statusCode ?? 500);
          this.metrics.apiRequestsFailedTotal.inc({ method, route, status });
        },
      }),
    );
  }
}

