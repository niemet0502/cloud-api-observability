import type { Scenario, ScenarioContext } from './types.js';
import { randomAmount, randomCustomerId, randomProduct } from './types.js';

interface OrderResponse {
  id: string;
  customerId: string;
  valueEur: number;
  description?: string;
  createdAt: string;
}

export const orderFlowScenario: Scenario = {
  name: 'OrderFlow',
  weight: 30,

  async run(ctx: ScenarioContext): Promise<void> {
    // 1. Create an order
    const createRes = await ctx.client.post<OrderResponse>('/orders', {
      customerId: randomCustomerId(),
      valueEur: randomAmount(),
      description: randomProduct(),
    });

    if (createRes.status === 201 && createRes.data?.id) {
      ctx.createdOrderIds.push(createRes.data.id);
    }

    // 2. List all orders
    await ctx.client.get('/orders');

    // 3. Fetch the created order by ID (if we got one)
    if (createRes.data?.id) {
      await ctx.client.get(`/orders/${createRes.data.id}`);
    }
  },
};
