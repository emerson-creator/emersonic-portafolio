export type Project = {
  slug: string;
  kind: "Deployed";
  title: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
  hasCaseStudy: boolean; // true = existe la página /projects/[slug]
  draft?: boolean; // true = solo visible en desarrollo, oculto en producción
};

export const projects: Project[] = [
  {
    slug: "prism-store",
    kind: "Deployed",
    title: "Prism Store",
    description:
      "Production-oriented ecommerce platform: a NestJS API with JWT authentication, Stripe payments with webhooks and refunds, and a Next.js storefront. Deployed to a Linux VPS with CI/CD, health checks and automatic rollback.",
    stack: [
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "Prisma",
      "Stripe",
      "Docker",
      "GitHub Actions",
      "Nginx",
    ],
    links: [
      { label: "Live site", href: "https://prism.emersonic.dev" },
      {
        label: "Frontend repo",
        href: "https://github.com/emerson-creator/prism_web",
      },
      {
        label: "Backend repo",
        href: "https://github.com/emerson-creator/prism_api",
      },
    ],
    hasCaseStudy: true,
  },
  {
    slug: "mediaflow-ai",
    kind: "Deployed",
    title: "MediaFlow AI",
    description:
      "Event-driven media pipeline: direct-to-storage uploads with presigned URLs, RabbitMQ, a Python worker that transcribes and summarizes with AI, and live progress over WebSockets. Runs on Hetzner with Prometheus and Grafana monitoring.",
    stack: [
      "React",
      "NestJS",
      "Python",
      "FastAPI",
      "RabbitMQ",
      "MinIO",
      "PostgreSQL",
      "Socket.io",
      "Docker",
      "Prometheus",
    ],
    links: [
      // TODO: replace with the real URLs
      { label: "Live site", href: "https://your-domain.dev" },
      {
        label: "Repo",
        href: "https://github.com/emerson-creator/mediaflow-ai",
      },
    ],
    hasCaseStudy: true,
    draft: true, // quita esta línea cuando MediaFlow esté realmente en producción
  },
  {
    slug: "pulsemetrics",
    kind: "Deployed",
    title: "PulseMetrics",
    description:
      "Self-hosted observability platform on OpenTelemetry and the Grafana ecosystem: metrics, logs and traces correlated in one place, with dashboards as code and alerting. Monitors a distributed system running on Hetzner.",
    stack: [
      "OpenTelemetry",
      "Prometheus",
      "Loki",
      "Tempo",
      "Grafana",
      "Docker",
      "Nginx",
    ],
    links: [
      // TODO: replace with the real URL
      {
        label: "Repo",
        href: "https://github.com/emerson-creator/pulsemetrics",
      },
    ],
    hasCaseStudy: true,
    draft: true, // quita esta línea cuando PulseMetrics esté realmente en producción
  },
];

// Lo que se muestra: los draft solo aparecen en desarrollo
export const visibleProjects = projects.filter(
  (p) => !p.draft || process.env.NODE_ENV !== "production",
);
