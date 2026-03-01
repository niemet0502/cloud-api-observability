import axios, { type AxiosInstance, type AxiosRequestConfig, type Method } from 'axios';

export interface HttpResponse<T = unknown> {
  status: number;
  data: T;
  durationMs: number;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10_000,
      validateStatus: () => true, // never throw on any status code
    });
  }

  async request<T = unknown>(
    method: Method,
    path: string,
    data?: unknown,
  ): Promise<HttpResponse<T>> {
    const start = performance.now();
    const config: AxiosRequestConfig = { method, url: path };
    if (data !== undefined) config.data = data;

    const res = await this.client.request<T>(config);
    const durationMs = Math.round(performance.now() - start);

    return {
      status: res.status,
      data: res.data,
      durationMs,
    };
  }

  get<T = unknown>(path: string) {
    return this.request<T>('GET', path);
  }

  post<T = unknown>(path: string, data: unknown) {
    return this.request<T>('POST', path, data);
  }
}
