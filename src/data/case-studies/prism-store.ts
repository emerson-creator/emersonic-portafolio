import type { CaseStudy } from "./types";

// Diagram helpers: r = horizontal rule, s = spaces, row = one line of text inside a box
const r = (n: number) => "─".repeat(n);
const s = (n: number) => " ".repeat(n);
const row = (text: string, inner: number) =>
  "│" + (" " + text).padEnd(inner) + "│";

const architecture = [
  "┌" + r(9) + "┐",
  row("Browser", 9),
  "└" + r(4) + "┬" + r(4) + "┘",
  s(5) + "│ HTTPS",
  s(5) + "▼",
  "┌" + r(34) + "┐",
  row("Nginx", 34),
  row("HTTPS and reverse proxy", 34),
  "└" + r(6) + "┬" + r(19) + "┬" + r(7) + "┘",
  s(7) + "│" + s(19) + "│",
  s(7) + "▼" + s(19) + "▼",
  "┌" + r(14) + "┐" + s(4) + "┌" + r(14) + "┐",
  row("Next.js web", 14) + s(4) + row("NestJS API", 14),
  row("(prism_web)", 14) + "───►" + row("(api)", 14),
  "└" + r(14) + "┘" + s(4) + "└" + r(6) + "┬" + r(7) + "┘",
  s(27) + "│",
  s(27) + "▼",
  s(20) + "┌" + r(19) + "┐",
  s(20) + row("Neon (PostgreSQL)", 19),
  s(20) + row("Stripe", 19),
  s(20) + row("Cloudinary", 19),
  s(20) + row("Resend", 19),
  s(20) + "└" + r(19) + "┘",
].join("\n");

const pipeline = [
  s(3) + "Push to main",
  s(9) + "│",
  s(9) + "▼",
  "┌" + r(17) + "┐",
  row("CI", 17),
  row("npm ci", 17),
  row("ESLint", 17),
  row("Build", 17),
  "└" + r(8) + "┬" + r(8) + "┘",
  s(9) + "│ success",
  s(9) + "▼",
  "Build Docker image",
  s(9) + "│",
  s(9) + "▼",
  s(4) + "Docker Hub",
  s(9) + "│",
  s(9) + "▼",
  s(4) + "SSH to VPS",
  s(9) + "│",
  s(9) + "▼",
  "Pull image by Git SHA",
  s(9) + "│",
  s(9) + "▼",
  s(1) + "Recreate container",
  s(9) + "│",
  s(9) + "▼",
  "Health check /health",
  s(9) + "│",
  s(4) + "┌" + r(4) + "┴" + r(4) + "┐",
  s(4) + "│" + s(9) + "│",
  s(3) + "OK" + s(7) + "FAIL",
  s(4) + "│" + s(9) + "│",
  s(4) + "▼" + s(9) + "▼",
  "Save SHA" + s(2) + "Automatic",
  s(10) + "rollback",
].join("\n");

export const prismStore: CaseStudy = {
  summary:
    "A production ecommerce platform: a NestJS API with JWT authentication, Stripe payments with webhooks and refunds, and a Next.js storefront. It is deployed to a Linux VPS through GitHub Actions, with health checks and automatic rollback.",
  facts: [
    {
      label: "Role",
      value: "Solo project: backend, frontend and infrastructure",
    },
    {
      label: "Scope",
      value: "Auth, catalog, cart, orders, payments and refunds",
    },
    { label: "Hosting", value: "Linux VPS with Nginx and HTTPS" },
    { label: "Delivery", value: "CI/CD with health checks and rollback" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          type: "paragraph",
          text: "Prism is an ecommerce platform I built end to end and run in production: a Next.js storefront and a NestJS API. It covers the flows where mistakes cost money (pricing, stock and payments) and the work around the code: containers, CI/CD and deploying to a server I set up and secured myself.",
        },
        {
          type: "list",
          items: [
            "Customers browse products by category, fill a cart and pay through Stripe.",
            "Orders move through statuses with tracking, and customers confirm delivery themselves.",
            "Admins manage products, categories, orders and refunds.",
            "Product images are stored in Cloudinary, and emails go out when an order is received, shipped and delivered.",
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
          text: "A Next.js web app and a NestJS API run as separate containers on one Linux VPS. Nginx is the only public entry point: it terminates HTTPS and forwards traffic to the containers, whose ports stay private. PostgreSQL lives on Neon, outside the server.",
        },
        {
          type: "diagram",
          label:
            "Production architecture. The browser reaches Nginx over HTTPS. Nginx routes to the Next.js web app and to the NestJS API. The web app calls the API over the internal network. The API uses Neon PostgreSQL, Stripe, Cloudinary and Resend.",
          art: architecture,
          caption:
            "Stripe also calls back into the API with webhook events. The arrow between web and API is server-side rendering over the internal Docker network.",
        },
        {
          type: "list",
          items: [
            "Web (prism_web): Next.js App Router, React 19, Tailwind CSS, Zustand for cart state and Stripe's React SDK for payment.",
            "API (api): NestJS in a modular structure, versioned under /api/v1.",
            "Database: PostgreSQL on Neon, accessed through Prisma.",
            "Integrations: Stripe for payments, Cloudinary for images and Resend for email.",
            "Edge: Nginx with a Let's Encrypt certificate.",
          ],
        },
      ],
    },
    {
      id: "authentication",
      title: "Authentication",
      blocks: [
        {
          type: "paragraph",
          text: "JWT with two tokens: an access token and a refresh token. The web app renews the access token silently, so a session does not break while someone is shopping. Roles decide who can reach admin routes.",
        },
        {
          type: "list",
          items: [
            "Access and refresh tokens, with silent refresh on the client.",
            "Role-based access control: admin routes sit behind role guards.",
            "Protected routes and global request validation.",
          ],
        },
        {
          type: "image",
          alt: "Sequence diagram of authentication: login returns an access token and a refresh token, and an expired access token is renewed silently with the refresh token.",
          hint: "Diagram idea: login, access token expiry and silent refresh. Save as public/images/prism-store/auth-flow.png",
          aspect: "16 / 9",
        },
      ],
    },
    {
      id: "payments",
      title: "Payments",
      blocks: [
        {
          type: "paragraph",
          text: "The client never decides money. The API computes prices from the database at checkout, creates a Stripe Payment Intent from the stored order total, and waits for Stripe's webhook to confirm the result.",
        },
        {
          type: "list",
          items: [
            "Checkout: CartService.checkout() builds the order from server-side prices.",
            "Payment: the amount of the Payment Intent is read from the order, not from the request.",
            "Confirmation: Stripe webhooks tell the API when a payment succeeds or fails, even if the browser is closed.",
            "Consistency: payment, order and stock updates run in one Prisma transaction.",
            "Refunds: admins trigger Stripe refunds from the admin workflow, and the payment and order states follow.",
          ],
        },
        {
          type: "image",
          alt: "Sequence diagram of a payment: the client asks the API to check out, the API creates a Stripe Payment Intent, the browser confirms it with Stripe, and Stripe sends a webhook that the API uses to update the payment, the order and the stock.",
          hint: "Diagram idea: client, API, Stripe and database, from checkout to webhook. Save as public/images/prism-store/payment-flow.png",
          aspect: "16 / 9",
        },
      ],
    },
    {
      id: "data-model",
      title: "Data model",
      blocks: [
        {
          type: "paragraph",
          text: "PostgreSQL with Prisma. Eight models cover the whole flow.",
        },
        {
          type: "list",
          items: [
            "User, Product and Category: accounts and the catalog.",
            "Cart and CartItem: what a customer is about to buy.",
            "Order and OrderItem: what was bought, with a status, a tracking number and notes.",
            "Payment: with a status of PENDING, COMPLETED, FAILED or REFUNDED.",
          ],
        },
        {
          type: "image",
          alt: "Entity relationship diagram of the eight models: User, Product, Category, Cart, CartItem, Order, OrderItem and Payment.",
          hint: "Diagram idea: an ERD of the Prisma schema. Save as public/images/prism-store/data-model.png",
          aspect: "4 / 3",
        },
      ],
    },
    {
      id: "api",
      title: "API engineering",
      blocks: [
        {
          type: "list",
          items: [
            "REST API versioned under /api/v1 and documented with Swagger/OpenAPI.",
            "Global request validation, CORS configuration and request throttling.",
            "Product image uploads to Cloudinary, with the backend managing the image URLs.",
            "A /health endpoint that the deployment script checks after every release.",
          ],
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery pipeline",
      blocks: [
        {
          type: "diagram",
          label:
            "API deployment pipeline. A push to main runs CI (npm ci, ESLint, build). On success a Docker image is built and pushed to Docker Hub. The VPS pulls the image by Git SHA over SSH and recreates the container, then checks /health. If it passes, the SHA is saved; if it fails, the deployment rolls back automatically.",
          art: pipeline,
          caption:
            "The API's pipeline. Every deployment maps to an exact commit: images are tagged with the Git SHA.",
        },
        {
          type: "list",
          items: [
            "CI runs on every push to main: npm ci, ESLint and build. Only a green build continues.",
            "The API is a multi-stage Docker image: build tools stay out of the final image, which installs production dependencies only.",
            "Images are pushed to Docker Hub tagged with the commit SHA.",
            "The deploy script connects over SSH, pulls that exact image and recreates the container.",
            "It then calls /health. On success it saves the SHA as the current version; on failure it rolls back to the previous one. Every deployment is logged.",
          ],
        },
        {
          type: "paragraph",
          text: "Unit tests are not part of the pipeline yet. The generated test stubs were unconfigured, so I removed that step instead of keeping a check that proves nothing. Real tests come first, then the step returns.",
        },
      ],
    },
    {
      id: "infrastructure",
      title: "Infrastructure and security",
      blocks: [
        {
          type: "list",
          items: [
            "Docker and Docker Compose run separate frontend and backend containers. Their ports are private and reachable only through Nginx.",
            "Nginx as reverse proxy, with HTTPS from Let's Encrypt.",
            "UFW firewall.",
            "SSH with keys only: root login and password authentication are disabled.",
            "PostgreSQL is a managed database on Neon, reached through DATABASE_URL.",
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
              title: "The server decides the price",
              body: "CartService.checkout() is the only checkout path for customers, and it derives every price from the database. The old order endpoint took prices from the client. It became an admin-only createForAdmin() behind a role guard, and its DTO no longer includes a price per item.",
              note: {
                label: "Trade-off",
                text: "Admin-created orders needed their own endpoint instead of sharing the customer path.",
              },
            },
            {
              title: "Payments are confirmed by webhooks, not by the browser",
              body: "A browser can close, lose connection or lie. Stripe's webhook is a server-to-server message about what really happened, so that is what moves the payment and the order forward.",
              note: {
                label: "Trade-off",
                text: "State updates arrive asynchronously, so an order can briefly lag behind the payment.",
              },
            },
            {
              title: "Stock and payment change in one transaction",
              body: "The stock decrement lives in the same Prisma transaction that updates the payment and the order. Either everything is recorded or nothing is, so stock never drifts from what was paid.",
            },
            {
              title: "A self-managed VPS instead of a managed platform",
              body: "I chose a Linux VPS over AWS, Railway or Fly.io to practice what a managed platform hides: provisioning a server, a reverse proxy, TLS, hardening and deploy automation.",
              note: {
                label: "Trade-off",
                text: "More to maintain: updates, monitoring and backups are my job.",
              },
            },
            {
              title: "Images are tagged with the Git commit SHA",
              body: "Every deployment maps to an exact commit, and a rollback means starting the previous tag instead of rebuilding anything.",
              note: {
                label: "Trade-off",
                text: "It needs a registry and a script that remembers the last good version.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "problems",
      title: "Problems I solved",
      blocks: [
        {
          type: "entries",
          items: [
            {
              title: "The frontend could not reach the API inside Docker",
              body: "Server-side rendering runs inside the web container and was calling localhost:3000, which is the container itself, not the API. I split the URL in two: INTERNAL_API_URL points to the API's service name on the Docker network for server-side calls, and NEXT_PUBLIC_API_URL stays public for the browser.",
            },
          ],
        },
      ],
    },
    {
      id: "next",
      title: "What's next",
      blocks: [
        {
          type: "list",
          items: [
            "Real unit and end-to-end tests, running in CI.",
            "A cron job that cancels abandoned PENDING orders.",
          ],
        },
      ],
    },
  ],
};
