import { loadConfig } from './config.js';
import { HttpClient } from './httpClient.js';
import { browseScenario } from './scenarios/browse.js';
import { errorScenario } from './scenarios/errors.js';
import { orderFlowScenario } from './scenarios/orderFlow.js';
import { orderThenPayScenario } from './scenarios/orderThenPay.js';
import { paymentFlowScenario } from './scenarios/paymentFlow.js';
import type { Scenario, ScenarioContext } from './scenarios/types.js';
import { pickByWeight } from './scenarios/types.js';

/* ── Config & State ──────────────────────────────────── */

const config = loadConfig();
let stopping = false;

const scenarios: Scenario[] = [
  orderFlowScenario,
  paymentFlowScenario,
  orderThenPayScenario,
  browseScenario,
  errorScenario,
];

const sharedCtx: ScenarioContext = {
  client: new HttpClient(config.baseUrl),
  createdOrderIds: [],
  createdPaymentIds: [],
};

/* ── Stats ───────────────────────────────────────────── */

interface ScenarioStats {
  runs: number;
  errors: number;
  totalDurationMs: number;
}

const stats = new Map<string, ScenarioStats>();
for (const s of scenarios) {
  stats.set(s.name, { runs: 0, errors: 0, totalDurationMs: 0 });
}

function printStats() {
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│                    📊  Traffic Stats                        │');
  console.log('├──────────────────┬───────┬────────┬──────────────────────────┤');
  console.log('│ Scenario         │ Runs  │ Errors │ Avg Latency (ms)         │');
  console.log('├──────────────────┼───────┼────────┼──────────────────────────┤');
  for (const [name, s] of stats) {
    const avg = s.runs > 0 ? Math.round(s.totalDurationMs / s.runs) : 0;
    console.log(
      `│ ${name.padEnd(16)} │ ${String(s.runs).padStart(5)} │ ${String(s.errors).padStart(6)} │ ${String(avg).padStart(24)} │`,
    );
  }
  console.log('├──────────────────┼───────┼────────┼──────────────────────────┤');
  const totals = [...stats.values()].reduce(
    (acc, s) => ({ runs: acc.runs + s.runs, errors: acc.errors + s.errors }),
    { runs: 0, errors: 0 },
  );
  console.log(
    `│ ${'TOTAL'.padEnd(16)} │ ${String(totals.runs).padStart(5)} │ ${String(totals.errors).padStart(6)} │                          │`,
  );
  console.log('└──────────────────┴───────┴────────┴──────────────────────────┘\n');
}

/* ── Helpers ─────────────────────────────────────────── */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): number {
  return config.minDelayMs + Math.random() * (config.maxDelayMs - config.minDelayMs);
}

/* ── Worker Loop ─────────────────────────────────────── */

async function workerLoop(workerId: number): Promise<void> {
  while (!stopping) {
    const scenario = pickByWeight(scenarios);
    const start = performance.now();

    try {
      await scenario.run(sharedCtx);

      const durationMs = Math.round(performance.now() - start);
      const scenarioStats = stats.get(scenario.name)!;
      scenarioStats.runs++;
      scenarioStats.totalDurationMs += durationMs;

      console.log(
        JSON.stringify({
          worker: workerId,
          scenario: scenario.name,
          status: 'ok',
          durationMs,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (err) {
      const durationMs = Math.round(performance.now() - start);
      const scenarioStats = stats.get(scenario.name)!;
      scenarioStats.runs++;
      scenarioStats.errors++;
      scenarioStats.totalDurationMs += durationMs;

      console.log(
        JSON.stringify({
          worker: workerId,
          scenario: scenario.name,
          status: 'error',
          error: err instanceof Error ? err.message : String(err),
          durationMs,
          timestamp: new Date().toISOString(),
        }),
      );
    }

    if (!stopping) {
      await sleep(randomDelay());
    }
  }
}

/* ── Main ────────────────────────────────────────────── */

async function main() {
  console.log('🚀 Traffic Simulator starting…');
  console.log(`   Base URL:       ${config.baseUrl}`);
  console.log(`   Workers:        ${config.workers}`);
  console.log(`   Delay:          ${config.minDelayMs}–${config.maxDelayMs} ms`);
  console.log(`   Stats interval: ${config.statsIntervalMs} ms`);
  console.log(`   Scenarios:      ${scenarios.map((s) => `${s.name}(w=${s.weight})`).join(', ')}`);
  console.log('   Press Ctrl+C to stop gracefully.\n');

  // Periodic stats printer
  const statsTimer = setInterval(printStats, config.statsIntervalMs);

  // Graceful shutdown
  const shutdownHandler = () => {
    if (stopping) return; // already shutting down
    stopping = true;
    console.log('\n⏳ Shutting down… waiting for in-flight scenarios to finish.');
    clearInterval(statsTimer);
  };
  process.on('SIGINT', shutdownHandler);
  process.on('SIGTERM', shutdownHandler);

  // Start workers
  const workers: Promise<void>[] = [];
  for (let i = 0; i < config.workers; i++) {
    workers.push(workerLoop(i));
  }

  await Promise.all(workers);

  // Final stats
  printStats();
  console.log('✅ Traffic Simulator stopped cleanly.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
