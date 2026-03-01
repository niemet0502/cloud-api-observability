import { HttpClient } from '../httpClient.js';

export interface ScenarioContext {
  client: HttpClient;
  createdOrderIds: string[];
  createdPaymentIds: string[];
}

export interface Scenario {
  name: string;
  weight: number;
  run(ctx: ScenarioContext): Promise<void>;
}

/**
 * Pick a scenario based on weighted random selection.
 */
export function pickByWeight(scenarios: Scenario[]): Scenario {
  const totalWeight = scenarios.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const scenario of scenarios) {
    rand -= scenario.weight;
    if (rand <= 0) return scenario;
  }
  return scenarios[scenarios.length - 1];
}

/* ── Random data helpers ─────────────────────────────── */

const PRODUCT_NAMES = [
  'Widget A', 'Widget B', 'Gadget Pro', 'Ultra Sensor',
  'Nano Controller', 'Power Module', 'Smart Relay', 'Flux Capacitor',
  'Turbo Encabulator', 'Micro Actuator',
];

const CUSTOMER_IDS = [
  'CUST-001', 'CUST-002', 'CUST-003', 'CUST-004', 'CUST-005',
  'CUST-006', 'CUST-007', 'CUST-008', 'CUST-009', 'CUST-010',
];

const PAYMENT_METHODS = ['card', 'bank_transfer', 'paypal', 'crypto', 'invoice'];

export function randomCustomerId(): string {
  return CUSTOMER_IDS[Math.floor(Math.random() * CUSTOMER_IDS.length)];
}

export function randomProduct(): string {
  return PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
}

export function randomAmount(min = 5, max = 500): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function randomPaymentMethod(): string {
  return PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)];
}

export function randomElement<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}
