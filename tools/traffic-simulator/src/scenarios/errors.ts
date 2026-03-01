import type { Scenario, ScenarioContext } from './types.js';

export const errorScenario: Scenario = {
  name: 'Error',
  weight: 10,

  async run(ctx: ScenarioContext): Promise<void> {
    const variant = Math.floor(Math.random() * 4);

    switch (variant) {
      case 0:
        // Missing required fields → 400
        await ctx.client.post('/orders', {});
        break;
      case 1:
        // Negative amount → 400
        await ctx.client.post('/orders', {
          customerId: 'BAD-CUST',
          valueEur: -10,
          description: 'Invalid order',
        });
        break;
      case 2:
        // Non-existent order → 404
        await ctx.client.get('/orders/00000000-0000-0000-0000-000000000000');
        break;
      case 3:
        // Non-existent payment → 404
        await ctx.client.get('/payments/00000000-0000-0000-0000-000000000000');
        break;
    }
  },
};
