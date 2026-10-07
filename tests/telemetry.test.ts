import assert from 'assert';
import { trace } from '@opentelemetry/api';
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
  type InMemorySpanExporter as ExporterType,
} from '@opentelemetry/sdk-trace-base';
import { createService } from '../src/service';
import { MemoryStore } from '../src/store';
import type { ProductRecord } from '../src/types';

declare global {
  // Populated by tests/setup/otel-bootstrap.ts during Vitest runs.
  // eslint-disable-next-line no-var
  var __otelExporter: ExporterType | undefined;
}

function activeExporter(): ExporterType {
  if (global.__otelExporter) {
    return global.__otelExporter;
  }

  const exporter = new InMemorySpanExporter();
  const provider = new BasicTracerProvider({ spanProcessors: [new SimpleSpanProcessor(exporter)] });
  trace.disable();
  trace.setGlobalTracerProvider(provider);
  global.__otelExporter = exporter;
  return exporter;
}

describe('telemetry (OpenTelemetry spans)', function () {
  // beforeEach/afterEach exist under both Mocha and Vitest (before/after do not).
  beforeEach(function () {
    activeExporter().reset();
  });

  afterEach(function () {
    if (!process.env.VITEST) {
      trace.disable();
      global.__otelExporter = undefined;
    }
  });

  it('emits a span for every service call', function () {
    const service = createService(new MemoryStore<ProductRecord>());
    const created = service.upsert({ title: 'Plot C' }, 'owner');
    assert.strictEqual(created.ok, true);
    if (created.ok) service.move(created.value.id, 'published', 'owner');

    const names = activeExporter().getFinishedSpans().map((s) => s.name);
    assert.deepStrictEqual(names, ['service.upsert', 'service.move']);
  });

  it('records the role as a span attribute', function () {
    createService(new MemoryStore<ProductRecord>()).upsert({ title: 'Plot D' }, 'viewer');
    const [span] = activeExporter().getFinishedSpans();
    assert.ok(span);
    assert.strictEqual(span.attributes.role, 'viewer');
  });
});
