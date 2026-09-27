import type { CaseStudy } from "./types";

// Diagram helpers: r = horizontal rule, s = spaces, row = one line of text inside a box
const r = (n: number) => "─".repeat(n);
const s = (n: number) => " ".repeat(n);
const row = (text: string, inner: number) =>
  "│" + (" " + text).padEnd(inner) + "│";
const three = (a: string, b: string, c: string) => a + s(3) + b + s(3) + c;

const top = "┌" + r(18) + "┐";
const bottom = "└" + r(8) + "┬" + r(9) + "┘";
const rails = s(9) + "│" + s(22) + "│" + s(22) + "│";
const arrows = s(9) + "▼" + s(22) + "▼" + s(22) + "▼";

const pipeline = [
  three(top, top, top),
  three(
    row("Microservices", 18),
    row("Infrastructure", 18),
    row("Broker and DB", 18),
  ),
  three(
    row("NestJS gateway", 18),
    row("node-exporter", 18),
    row("RabbitMQ exporter", 18),
  ),
  three(
    row("FastAPI worker", 18),
    row("cAdvisor", 18),
    row("Postgres exporter", 18),
  ),
  three(row("Socket.io service", 18), row("", 18), row("", 18)),
  three(bottom, bottom, bottom),
  rails,
  arrows,
  "┌" + r(64) + "┐",
  row("OpenTelemetry Collector (OTLP on 4317 and 4318)", 64),
  row("Removes sensitive data, batches, forwards to the stores", 64),
  "└" + r(8) + "┬" + r(22) + "┬" + r(22) + "┬" + r(9) + "┘",
  rails,
  arrows,
  three(top, top, top),
  three(row("Prometheus", 18), row("Loki", 18), row("Tempo", 18)),
  three(row("Metrics", 18), row("Logs", 18), row("Traces", 18)),
  three(bottom, bottom, bottom),
  rails,
  arrows,
  "┌" + r(64) + "┐",
  row("Grafana", 64),
  row("Dashboards and alerting, behind Nginx with HTTPS", 64),
  "└" + r(64) + "┘",
].join("\n");

export const pulsemetrics: CaseStudy = {
  summary:
    "A self-hosted observability platform built on OpenTelemetry and the Grafana ecosystem. It collects metrics, logs and traces from a distributed system and correlates them: an error in a log leads to the exact trace of the request and to the server's CPU and memory at that moment.",
  facts: [
    {
      label: "Role",
      value: "Solo project: design, instrumentation and infrastructure",
    },
    { label: "Standard", value: "OpenTelemetry (OTLP)" },
    { label: "Signals", value: "Metrics, logs and traces" },
    { label: "Hosting", value: "Hetzner VPS, no license cost" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          type: "paragraph",
          text: "PulseMetrics is a self-hosted alternative to commercial platforms such as Datadog or New Relic. I built it to observe MediaFlow AI, a distributed system of several services and a message broker, where 'something is slow' or 'something failed' cannot be answered by looking at one process.",
        },
        {
          type: "paragraph",
          text: "Its guiding principle is unified correlation: an error in a log can be linked immediately to the exact trace of the request and to the CPU and memory of the server at that moment.",
        },
        {
          type: "list",
          items: [
            "One place for the three pillars of telemetry: metrics, logs and traces.",
            "Correlation between them, from a log line to its trace and to the server's load.",
            "Three dashboards built on standard methods, and four alert rules.",
            "Everything runs on my own VPS, with no licensing cost.",
          ],
        },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      blocks: [
        {
          type: "paragraph",
          text: "Applications and infrastructure send their telemetry to a single OpenTelemetry Collector. The Collector cleans it and routes each signal to a specialized store: Prometheus for metrics, Loki for logs and Tempo for traces. Grafana reads from all three, so one screen can move between them.",
        },
        {
          type: "diagram",
          label:
            "Telemetry architecture. Microservices, infrastructure exporters and the broker and database exporters send telemetry to the OpenTelemetry Collector. The Collector forwards metrics to Prometheus, logs to Loki and traces to Tempo. Grafana reads from the three stores.",
          art: pipeline,
          caption:
            "Log lines carry a trace ID, so Grafana can jump from a log to its trace and to the metrics at that moment.",
        },
      ],
    },
    {
      id: "instrumentation",
      title: "Instrumentation",
      blocks: [
        {
          type: "list",
          items: [
            "NestJS gateway: HTTP interceptors start a trace when a request arrives.",
            "Python worker: decorators measure how long FFmpeg and each call to the AI APIs (Whisper and Gemini) take.",
            "Node.js notification service: instrumented with the OpenTelemetry SDK as well.",
            "Infrastructure: node-exporter for the VPS, cAdvisor for the Docker containers, and exporters for RabbitMQ and PostgreSQL.",
          ],
        },
        {
          type: "paragraph",
          text: "All application telemetry goes to the Collector over OTLP (gRPC on port 4317, HTTP on 4318). The Collector removes sensitive data such as JWTs and API keys, batches what it receives and forwards it, so the applications never wait on the storage backends.",
        },
      ],
    },
    {
      id: "storage",
      title: "Storage",
      blocks: [
        {
          type: "list",
          items: [
            "Prometheus keeps the time series: CPU, memory, disk I/O and network of the VPS, per-container usage, HTTP response times, the rate of 5xx errors, RabbitMQ queue depth and active WebSocket connections.",
            "Loki collects the JSON logs the containers write to stdout. It indexes only labels such as service and environment, so disk usage on the VPS stays small.",
            "Tempo stores end-to-end traces, each with a unique trace ID: client, gateway, RabbitMQ, Python worker and PostgreSQL.",
          ],
        },
      ],
    },
    {
      id: "correlation",
      title: "From symptom to cause",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "An alert fires, or a graph shows a spike.",
            "In Loki, filter the logs by service and time. Every line carries a trace ID.",
            "Follow the trace ID into Tempo to see the whole request across the gateway, RabbitMQ, the worker and PostgreSQL, with the time spent in each step.",
            "Check Prometheus for the CPU, memory and queue depth of the server at that exact moment.",
          ],
        },
      ],
    },
    {
      id: "dashboards",
      title: "Dashboards",
      blocks: [
        {
          type: "paragraph",
          text: "Three dashboards ship with the platform. They are stored as JSON in the repository and provisioned automatically when Grafana is deployed.",
        },
        {
          type: "entries",
          items: [
            {
              title: "Infrastructure health (USE method)",
              body: "Utilization: CPU, memory and NVMe space of the VPS. Saturation: load average, open PostgreSQL connections and RabbitMQ queue length. Errors: network drops and container restarts.",
            },
            {
              title: "Services and APIs (RED method)",
              body: "Rate: HTTP requests per second at the gateway. Errors: the share of failed requests (4xx and 5xx). Duration: latency percentiles p50, p95 and p99.",
            },
            {
              title: "MediaFlow AI tracker (asynchronous work)",
              body: "Files processed successfully versus failed per hour, average AI transcription time per megabyte of audio, and processing lag: the time between a file entering RabbitMQ and the worker picking it up.",
            },
          ],
        },
        {
          type: "image",
          alt: "Screenshot of the infrastructure health dashboard in Grafana, showing CPU, memory and disk utilization, load average, RabbitMQ queue length and container restarts.",
          hint: "Screenshot of the infrastructure dashboard. Save as public/images/pulsemetrics/dashboard-infrastructure.png",
          aspect: "16 / 9",
        },
        {
          type: "image",
          alt: "Screenshot of the services dashboard in Grafana, showing request rate, error percentage and latency percentiles p50, p95 and p99 for the API gateway.",
          hint: "Screenshot of the RED dashboard. Save as public/images/pulsemetrics/dashboard-services.png",
          aspect: "16 / 9",
        },
        {
          type: "image",
          alt: "Screenshot of the MediaFlow AI tracker dashboard in Grafana, showing processed and failed files per hour, transcription time per megabyte and processing lag.",
          hint: "Screenshot of the MediaFlow tracker. Save as public/images/pulsemetrics/dashboard-mediaflow.png",
          aspect: "16 / 9",
        },
        {
          type: "image",
          alt: "Screenshot of a trace in Grafana Tempo showing the spans of one request across the gateway, RabbitMQ, the Python worker and PostgreSQL.",
          hint: "Screenshot of one end-to-end trace in Tempo. Save as public/images/pulsemetrics/trace.png",
          aspect: "16 / 9",
        },
      ],
    },
    {
      id: "alerting",
      title: "Alerting",
      blocks: [
        {
          type: "paragraph",
          text: "Alert rules notify Discord, Telegram or email through webhooks.",
        },
        {
          type: "list",
          items: [
            "Critical: the server's memory stays above 90% for more than 5 minutes.",
            "Critical: the API gateway or the Python worker container is down.",
            "Warning: more than 50 messages wait unprocessed in RabbitMQ, a sign that the worker needs to scale.",
            "Warning: the HTTP 5xx rate is above 5% over the last 2 minutes.",
          ],
        },
      ],
    },
    {
      id: "deployment",
      title: "Deployment and access",
      blocks: [
        {
          type: "list",
          items: [
            "Runs on the same Hetzner VPS as the system it watches, at no licensing cost.",
            "Grafana sits behind Nginx with an SSL certificate from Certbot and password authentication.",
            "Dashboards live in the repository as JSON and are provisioned when the container is deployed, so the whole setup can be rebuilt on a new server.",
          ],
        },
      ],
    },
    {
      id: "decisions",
      title: "Key decisions",
      blocks: [
        {
          type: "entries",
          items: [
            {
              title: "Open standards and self-hosting instead of a vendor",
              body: "Instrumentation uses OpenTelemetry, so the code is not tied to any backend and the stores can change without touching the applications. Hosting it myself avoids licensing costs and forces me to understand how each piece works.",
              note: {
                label: "Trade-off",
                text: "More to assemble and operate than a commercial product that works out of the box.",
              },
            },
            {
              title: "A Collector between the applications and the stores",
              body: "The applications know one endpoint. The Collector strips sensitive data, batches, and forwards, so tokens never reach storage and slow backends never slow a request.",
              note: {
                label: "Trade-off",
                text: "One more component on the path of every signal.",
              },
            },
            {
              title: "Loki indexes labels, not log text",
              body: "Indexing only labels such as service and environment keeps disk usage low on a single VPS.",
              note: {
                label: "Trade-off",
                text: "Searching inside log text is slower than with a full-text index.",
              },
            },
            {
              title: "Correlation through the trace ID",
              body: "One trace ID ties a log line to its trace, and the timestamp ties it to the metrics. That is what turns three separate tools into one investigation.",
              note: {
                label: "Trade-off",
                text: "Every service has to propagate the trace context, including through RabbitMQ messages.",
              },
            },
            {
              title: "Dashboards and alerts as code",
              body: "Dashboards are JSON in the repository and are provisioned on deploy, so the monitoring is versioned and reproducible.",
              note: {
                label: "Trade-off",
                text: "Changes made in the Grafana UI do not stick unless they are exported back to the repository.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      blocks: [
        {
          type: "list",
          items: [
            "The platform shares a VPS with what it watches. A full server outage takes both down, so it cannot alert on that.",
            "Data is stored locally, so retention is bounded by the VPS disk.",
          ],
        },
      ],
    },
  ],
};
