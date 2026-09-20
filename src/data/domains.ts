export type Domain = {
  id: "backend" | "devops" | "fullstack"; // debe coincidir con los href de navigation.ts
  code: string;
  title: string;
  tagline: string;
  points: string[];
  stack: string[];
};

export const domains: Domain[] = [
  {
    id: "backend",
    code: "[BE]",
    title: "Backend",
    tagline: "APIs that stay correct when money and stock are involved",
    points: [
      "Checkout prices are computed on the server, so a client can never set what it pays.",
      "Stock and payment updates run in one database transaction: they succeed or fail together.",
      "Payment amounts come from the stored order total, and admin routes sit behind role guards.",
      "Transactional emails (order received, shipped, delivered) sent through Resend.",
    ],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "JWT"],
  },
  {
    id: "devops",
    code: "[DO]",
    title: "DevOps",
    tagline: "I run what I build: containers, pipelines and a server I set up",
    points: [
      "Docker Compose runs the full stack locally, including the internal and public API URLs that server rendering needs.",
      "GitHub Actions runs lint and build on every push, in both the backend and frontend repos.",
      "Production runs on a self-managed Hetzner VPS with a Caddy reverse proxy, automatic TLS and SSH-based deploys.",
      "Bookd: microservices on Kubernetes with Ingress NGINX, Skaffold and secrets-based auth.",
      "Studying for an AWS certification: load balancing, Auto Scaling, RDS and Route 53.",
    ],
    stack: ["Docker", "GitHub Actions", "Caddy", "Linux", "Kubernetes", "AWS"],
  },
  {
    id: "fullstack",
    code: "[FS]",
    title: "Fullstack",
    tagline: "From the database schema to the checkout button",
    points: [
      "A storefront on Next.js App Router, React 19 and Tailwind CSS, with cart state in Zustand and Stripe's React SDK for payments.",
      "Server-rendered pages call the API over the internal network, while the browser uses the public URL.",
      "A WebRTC video call app in React and TypeScript, audited to a 100/100 Lighthouse accessibility score.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "NestJS",
    ],
  },
];
