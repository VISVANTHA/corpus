import { defineConfig } from 'vitest/config';

// Stryker re-runs the suite once per mutant inside its own worker processes,
// which it marks with STRYKER_MUTATOR_WORKER. The OpenTelemetry bootstrap is
// only needed to export spans, and tests/telemetry.test.ts registers its own
// tracer when the bootstrap is absent, so mutation runs skip it.
const underStryker = Boolean(process.env.STRYKER_MUTATOR_WORKER);

// Vitest runs the SAME spec files as Mocha (globals: true), so the suite is
// identical under both runners.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: underStryker
      ? ['tests/setup/vitest-teardown.ts']
      : ['tests/setup/otel-bootstrap.ts', 'tests/setup/vitest-teardown.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'cobertura'],
      reportsDirectory: 'reports/vitest-coverage',
      include: ['src/**/*.ts'],
      exclude: ['tests/**', 'scripts/**'],
    },
  },
});
