import fs from 'node:fs';
import path from 'node:path';
import { trace } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  SimpleSpanProcessor,
  InMemorySpanExporter,
  type ReadableSpan,
} from '@opentelemetry/sdk-trace-base';

// Path a span-collecting harness asks for (the Testable white-box
// opentelemetry-spans collector sets this). Vitest workers are terminated
// rather than exited, so a harness hook listening for process exit never gets
// to write; the spans are exported from here instead, while the worker is alive.
const harnessFile = process.env.OTEL_SPAN_EXPORT_PATH;

const exporter = new InMemorySpanExporter();
// Tests reset ``exporter`` between cases, so the harness gets its own copy.
const harnessExporter = harnessFile ? new InMemorySpanExporter() : undefined;
const provider = new NodeTracerProvider({
  spanProcessors: [
    new SimpleSpanProcessor(exporter),
    ...(harnessExporter ? [new SimpleSpanProcessor(harnessExporter)] : []),
  ],
});
// A span-collecting harness may have registered its own global provider before
// this setup file ran. The OpenTelemetry API ignores a second registration, so
// clear any existing one first; otherwise the spans these tests create would
// never reach this exporter.
trace.disable();
trace.setGlobalTracerProvider(provider);

const reportsDir = path.join(__dirname, '../../reports');
const outFile = path.join(reportsDir, 'opentelemetry-spans.json');

function hrTimeToNano(value: [number, number]): number {
  return value[0] * 1e9 + value[1];
}

function harnessSpan(span: ReadableSpan) {
  return {
    name: span.name,
    traceId: span.spanContext().traceId,
    spanId: span.spanContext().spanId,
    durationMs: hrTimeToNano(span.duration) / 1e6,
    startTimeUnixNano: String(hrTimeToNano(span.startTime)),
    endTimeUnixNano: String(hrTimeToNano(span.endTime)),
  };
}

function withFileLock(target: string, fn: () => void): void {
  // Test files run in parallel workers; serialise the read-merge-write.
  const lock = `${target}.lock`;
  const pause = new Int32Array(new SharedArrayBuffer(4));
  let held = false;
  for (let attempt = 0; attempt < 500 && !held; attempt++) {
    try {
      fs.mkdirSync(lock);
      held = true;
    } catch {
      Atomics.wait(pause, 0, 0, 10);
    }
  }
  try {
    fn();
  } finally {
    if (held) fs.rmSync(lock, { recursive: true, force: true });
  }
}

function writeHarnessSpans(): void {
  if (!harnessFile || !harnessExporter) {
    return;
  }
  const finished = harnessExporter.getFinishedSpans();
  if (finished.length === 0) {
    return;
  }
  fs.mkdirSync(path.dirname(harnessFile), { recursive: true });
  withFileLock(harnessFile, () => mergeHarnessSpans(harnessFile, finished));
}

function mergeHarnessSpans(target: string, finished: ReadableSpan[]): void {
  // Each test file runs in its own worker, so merge with what earlier workers
  // already exported instead of overwriting it.
  let existing: Array<{ spanId?: string }> = [];
  try {
    const data = JSON.parse(fs.readFileSync(target, 'utf8'));
    if (Array.isArray(data.spans)) existing = data.spans;
  } catch {
    existing = [];
  }
  const seen = new Set(existing.map((s) => s.spanId));
  const merged = [...existing, ...finished.map(harnessSpan).filter((s) => !seen.has(s.spanId))];
  fs.writeFileSync(target, JSON.stringify({ spans: merged }));
}

function flushSpans(): void {
  writeHarnessSpans();
  const finished = exporter.getFinishedSpans();
  if (finished.length === 0) {
    return;
  }

  const spans = finished.map((span) => ({
    name: span.name,
    traceId: span.spanContext().traceId,
    spanId: span.spanContext().spanId,
    attributes: span.attributes,
    status: span.status,
  }));

  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      {
        tracer: 'granite-mill',
        sdk: '@opentelemetry/sdk-node',
        spanCount: spans.length,
        spans,
      },
      null,
      2
    )
  );
}

process.on('beforeExit', flushSpans);
process.on('exit', flushSpans);

const g = globalThis as typeof globalThis & {
  __otelExporter?: InMemorySpanExporter;
  __otelFlushSpans?: () => void;
};
g.__otelExporter = exporter;
g.__otelFlushSpans = flushSpans;
