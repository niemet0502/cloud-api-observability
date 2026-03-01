import type { Scenario, ScenarioContext } from './types.js';
import { randomAmount, randomCustomerId, randomPaymentMethod, randomProduct } from './types.js';

interface OrderResponse {
  id: string;
}

interface PaymentResponse {
  id: string;
}

export const orderThenPayScenario: Scenario = {
  name: 'OrderThenPay',
  weight: 20,

  async run(ctx: ScenarioContext): Promise<void> {
    const amount = randomAmount();

    // 1. Create an order
    const orderRes = await ctx.client.post<OrderResponse>('/orders', {
      customerId: randomCustomerId(),
      valueEur: amount,
      description: randomProduct(),
    });

    const orderId = orderRes.data?.id;
    if (orderRes.status === 201 && orderId) {
      ctx.createdOrderIds.push(orderId);
    }

    // 2. Immediately pay for it
    const paymentRes = await ctx.client.post<PaymentResponse>('/payments', {
      orderId: orderId ?? 'ORD-UNKNOWN',
      amountEur: amount,
      method: randomPaymentMethod(),
    });

    if (paymentRes.status === 201 && paymentRes.data?.id) {
      ctx.createdPaymentIds.push(paymentRes.data.id);
    }

    // 3. Verify both exist
    if (orderId) await ctx.client.get(`/orders/${orderId}`);
    if (paymentRes.data?.id) await ctx.client.get(`/payments/${paymentRes.data.id}`);
  },
};
