export interface Config {
  baseUrl: string;
  workers: number;
  minDelayMs: number;
  maxDelayMs: number;
  statsIntervalMs: number;
}

export function loadConfig(): Config {
  return {
    baseUrl: 'http://13.222.95.232:5000',
    workers: parseInt(process.env.WORKERS ?? '3', 10),
    minDelayMs: parseInt(process.env.MIN_DELAY_MS ?? '500', 10),
    maxDelayMs: parseInt(process.env.MAX_DELAY_MS ?? '2000', 10),
    statsIntervalMs: parseInt(process.env.STATS_INTERVAL_MS ?? '15000', 10),
  };
}
