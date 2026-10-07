import fs from 'node:fs';
import path from 'node:path';
import { trace } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor, InMemorySpanExporter } from '@opentelemetry/sdk-trace-base';

const exporter = new InMemorySpanExporter();
const provider = new NodeTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(exporter)],
});
trace.setGlobalTracerProvider(provider);

const reportsDir = path.join(__dirname, '../../reports');
const outFile = path.join(reportsDir, 'opentelemetry-spans.json');

function flushSpans(): void {
  const spans = exporter.getFinishedSpans().map((span) => ({
    name: span.name,
    traceId: span.spanContext().traceId,
    spanId: span.spanContext().spanId,
    attributes: span.attributes,
    status: span.status,
  }));

  if (spans.length === 0) {
    return;
  }

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
