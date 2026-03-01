import type { Scenario, ScenarioContext } from './types.js';
import { randomAmount, randomElement, randomPaymentMethod } from './types.js';

interface PaymentResponse {
  id: string;
  orderId: string;
  amountEur: number;
  method?: string;
  status: string;
  processedAt: string;
}

export const paymentFlowScenario: Scenario = {
  name: 'PaymentFlow',
  weight: 25,

  async run(ctx: ScenarioContext): Promise<void> {
    // Use an existing order ID if available, otherwise use a placeholder
    const orderId = randomElement(ctx.createdOrderIds) ?? 'ORD-UNKNOWN';

    // 1. Process a payment
    const createRes = await ctx.client.post<PaymentResponse>('/payments', {
      orderId,
      amountEur: randomAmount(),
      method: randomPaymentMethod(),
    });

    if (createRes.status === 201 && createRes.data?.id) {
      ctx.createdPaymentIds.push(createRes.data.id);
    }

    // 2. List all payments
    await ctx.client.get('/payments');

    // 3. Fetch the created payment by ID
    if (createRes.data?.id) {
      await ctx.client.get(`/payments/${createRes.data.id}`);
    }
  },
};
