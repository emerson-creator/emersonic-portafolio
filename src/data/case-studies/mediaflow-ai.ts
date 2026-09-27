import type { CaseStudy } from "./types";

// Diagram helpers: r = horizontal rule, s = spaces, row = one line of text inside a box
const r = (n: number) => "─".repeat(n);
const s = (n: number) => " ".repeat(n);
const row = (text: string, inner: number) =>
  "│" + (" " + text).padEnd(inner) + "│";
const two = (a: string, b: string) => a + s(4) + b;

const topology = [
  s(20) + "┌" + r(9) + "┐",
  s(20) + row("Browser", 9),
  s(20) + "└" + r(4) + "┬" + r(4) + "┘",
  s(25) + "│ HTTPS and WebSocket",
  s(25) + "▼",
  "┌" + r(50) + "┐",
  row("Nginx", 50),
  row("HTTPS and reverse proxy", 50),
  "└" + r(10) + "┬" + r(27) + "┬" + r(11) + "┘",
  s(11) + "│" + s(27) + "│",
  s(11) + "▼" + s(27) + "▼",
  two("┌" + r(22) + "┐", "┌" + r(22) + "┐"),
  two(row("API Gateway (NestJS)", 22), row("MinIO (S3 storage)", 22)),
  two(row("JWT, rate limiting", 22), row("Direct uploads", 22)),
  two(row("Presigned URLs", 22), row("Media files", 22)),
  two("└" + r(10) + "┬" + r(11) + "┘", "└" + r(10) + "┬" + r(11) + "┘"),
  s(11) + "│" + s(27) + "│",
  s(11) + "▼" + s(27) + "▼",
  "┌" + r(50) + "┐",
  row("RabbitMQ", 50),
  row("media.uploaded, media.processing, media.completed", 50),
  "└" + r(10) + "┬" + r(27) + "┬" + r(11) + "┘",
  s(11) + "│" + s(27) + "│",
  s(11) + "▼" + s(27) + "▼",
  two("┌" + r(22) + "┐", "┌" + r(22) + "┐"),
  two(row("Processing Worker", 22), row("Notification Service", 22)),
  two(row("Python, FastAPI", 22), row("Node.js, Socket.io", 22)),
  two(row("FFmpeg + AI APIs", 22), row("Live progress", 22)),
  two("└" + r(10) + "┬" + r(11) + "┘", "└" + r(22) + "┘"),
  s(11) + "│",
  s(11) + "▼",
  "┌" + r(22) + "┐",
  row("PostgreSQL", 22),
  row("Results and metadata", 22),
  "└" + r(22) + "┘",
].join("\n");

export const mediaflowAi: CaseStudy = {
  summary:
    "An event-driven media pipeline: users upload large audio and video files straight to storage, a Python worker transcribes and summarizes them with AI, and progress reaches the browser live over WebSockets. Three services, a message broker and monitoring, all deployed with Docker Compose on Hetzner.",
  facts: [
    {
      label: "Role",
      value: "Solo project: architecture, services and infrastructure",
    },
    { label: "Style", value: "Event-driven microservices" },
    { label: "Hosting", value: "Hetzner VPS with Docker Compose" },
    { label: "Observability", value: "Prometheus and Grafana" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          type: "paragraph",
          text: "MediaFlow AI turns recordings into text. Instead of another monolithic REST API, I split it into services that each do one job and talk through events. It is the counterpart to Prism Store: where Prism is a classic API with a database, this one is about moving heavy work off the request path.",
        },
        {
          type: "list",
          items: [
            "Upload large audio and video files directly to storage.",
            "Get a transcript, a summary and keywords for each file.",
            "Follow the progress live, without refreshing the page.",
            "JWT authentication and rate limiting at the gateway.",
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
          text: "A React client talks to Nginx, the only public entry point. Behind it, three services with separate responsibilities communicate through RabbitMQ: an API gateway that handles authentication and ingestion, a processing worker that does the heavy work, and a notification service that pushes live updates.",
        },
        {
          type: "diagram",
          label:
            "System architecture. The browser reaches Nginx over HTTPS and WebSocket. Nginx routes to the NestJS API gateway and to MinIO storage. The gateway publishes events to RabbitMQ. The Python processing worker and the Node.js notification service consume them, and the worker saves results in PostgreSQL.",
          art: topology,
          caption:
            "The worker downloads files from MinIO and publishes its progress back to RabbitMQ. The gateway also uses PostgreSQL for accounts and media records.",
        },
        {
          type: "list",
          items: [
            "Client: React, Vite and Tailwind CSS.",
            "API gateway: NestJS. JWT authentication, rate limiting, ingestion and presigned URL generation.",
            "Storage: MinIO, an S3-compatible object store.",
            "Broker: RabbitMQ carries the events between services.",
            "Processing worker: Python with FastAPI. FFmpeg for audio and AI APIs for transcription.",
            "Notification service: Node.js with Socket.io.",
            "Data: PostgreSQL for accounts, media records and results; Redis backs the gateway's rate limiting.",
          ],
        },
      ],
    },
    {
      id: "upload-flow",
      title: "Life of an upload",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "An authenticated user asks the gateway for permission to upload a file.",
            "The gateway checks the request (JWT and rate limit) and returns a temporary presigned URL for MinIO.",
            "The browser uploads the file straight to MinIO through that URL. The API never touches the bytes.",
            "When the upload finishes, the gateway publishes media.uploaded to RabbitMQ.",
            "The processing worker consumes the event, downloads the file and runs the pipeline.",
            "While it works, the worker publishes progress events, which the notification service consumes.",
            "Socket.io pushes each update to the user's browser, so the progress bar moves without a refresh.",
            "On media.completed, the transcript, summary and keywords are already saved in PostgreSQL.",
          ],
        },
        {
          type: "image",
          alt: "Sequence diagram of an upload: the browser requests a presigned URL from the gateway, uploads the file to MinIO, the gateway publishes media.uploaded, the worker processes the file and publishes progress, and the notification service pushes updates to the browser over WebSocket.",
          hint: "Diagram idea: browser, gateway, MinIO, RabbitMQ, worker and notification service, from upload to live update. Save as public/images/mediaflow-ai/upload-flow.png",
          aspect: "16 / 9",
        },
      ],
    },
    {
      id: "events",
      title: "Events",
      blocks: [
        {
          type: "paragraph",
          text: "Services never call each other directly. Everything moves through RabbitMQ, so the producer does not wait for, or even know about, the consumer.",
        },
        {
          type: "list",
          items: [
            "media.uploaded: published by the gateway when an upload finishes. Consumed by the worker.",
            "media.processing: published by the worker as it progresses (for example 25% and 50%). Consumed by the notification service.",
            "media.completed: published by the worker when the results are saved. Consumed by the notification service.",
          ],
        },
        {
          type: "image",
          alt: "Diagram of the RabbitMQ topology: the gateway publishes media.uploaded, the worker consumes it and publishes media.processing and media.completed, and the notification service consumes those.",
          hint: "Diagram idea: exchanges, queues and bindings for the three events. Save as public/images/mediaflow-ai/event-topology.png",
          aspect: "16 / 9",
        },
      ],
    },
    {
      id: "processing",
      title: "Processing pipeline",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Download the file from MinIO.",
            "Extract the audio with FFmpeg.",
            "Send it to AI APIs (Whisper and Gemini) to get a transcript, a summary and keywords.",
            "Save the results in PostgreSQL.",
          ],
        },
        {
          type: "paragraph",
          text: "Along the way the worker publishes its progress as events. FastAPI gives it a small HTTP surface for health checks and metrics, so Prometheus can watch it like any other service.",
        },
      ],
    },
    {
      id: "infrastructure",
      title: "Infrastructure and observability",
      blocks: [
        {
          type: "list",
          items: [
            "Docker Compose runs the whole stack on one Hetzner VPS: gateway, worker, notification service, RabbitMQ, PostgreSQL, Redis, MinIO and Nginx.",
            "Nginx terminates HTTPS and routes traffic to the gateway, to MinIO and to the WebSocket service.",
            "Prometheus collects CPU, memory and latency metrics from the services.",
            "Grafana shows the state of the VPS and the RabbitMQ queues on one dashboard.",
          ],
        },
        {
          type: "image",
          alt: "Diagram of the production deployment on a Hetzner VPS: the Docker Compose services, Nginx in front, and Prometheus and Grafana monitoring the rest.",
          hint: "Diagram idea: the VPS with its containers, plus the monitoring stack. Save as public/images/mediaflow-ai/deployment.png",
          aspect: "16 / 9",
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery pipeline",
      blocks: [
        {
          type: "list",
          items: [
            "GitHub Actions runs the tests for each service and builds its Docker image.",
            "Images are deployed over SSH to the Hetzner VPS.",
            "It follows the same pattern as Prism: images tagged with the Git commit SHA, and a health check after every release with automatic rollback.",
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
              title: "Files go straight to storage",
              body: "A 500 MB video should never pass through the API. The gateway only signs a temporary presigned URL, and the browser uploads directly to MinIO. The API stays light, and upload size stops being an API problem.",
              note: {
                label: "Trade-off",
                text: "The API never sees the bytes, so it needs an explicit event to know an upload finished.",
              },
            },
            {
              title: "Processing is asynchronous and event-driven",
              body: "Transcription takes minutes, so no HTTP request waits for it. The gateway publishes media.uploaded and moves on. The worker can be slow, restarted or scaled without touching the API.",
              note: {
                label: "Trade-off",
                text: "The system is eventually consistent, and there are more moving parts to run and monitor.",
              },
            },
            {
              title: "Each service does one job, in the right language",
              body: "The gateway is NestJS because it reuses Prism's authentication and module structure. The worker is Python because FFmpeg and the AI tooling live there. The notification service is a thin Node.js process because long-lived WebSocket connections scale differently from request and response APIs.",
              note: {
                label: "Trade-off",
                text: "Two runtimes to build, test and deploy.",
              },
            },
            {
              title: "S3-compatible storage on my own server",
              body: "MinIO speaks the S3 API, so presigned URLs work like they do on AWS S3, and moving to S3 later would mostly be a configuration change.",
              note: {
                label: "Trade-off",
                text: "I run the storage myself: disk space and backups are my job.",
              },
            },
            {
              title: "Monitoring from day one",
              body: "With several services and a queue, 'is it working?' needs numbers. Prometheus and Grafana show CPU, memory, latency and queue depth in one place.",
              note: {
                label: "Trade-off",
                text: "The monitoring stack shares the VPS, so it competes for resources with the services it watches.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "limits",
      title: "Limits and next steps",
      blocks: [
        {
          type: "list",
          items: [
            "Everything runs on one VPS, so there is no redundancy: a server outage takes every service down.",
            "Processing capacity is bounded by the workers that fit on that machine. Scaling out would mean moving workers to more servers.",
            "Transcription depends on external AI APIs, so cost and rate limits are outside my control.",
          ],
        },
      ],
    },
  ],
};
