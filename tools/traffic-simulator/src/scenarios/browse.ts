import type { Scenario, ScenarioContext } from './types.js';

export const browseScenario: Scenario = {
  name: 'Browse',
  weight: 15,

  async run(ctx: ScenarioContext): Promise<void> {
    // Simulate a read-only dashboard/monitoring user
    await ctx.client.get('/orders');
    await ctx.client.get('/payments');
    await ctx.client.get('/metrics');
  },
};
