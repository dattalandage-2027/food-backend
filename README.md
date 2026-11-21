# Food Backend

Backend services and APIs for the food platform.

## Responsibilities

- Authentication and authorization
- Restaurant and menu management
- Cart, order, and delivery workflows
- Database integration and API tests

## Related repositories

- `food-frontend` — customer-facing web application
- `jenkins-pipelines` — CI/CD pipeline definitions
- `k8s-gitops` — Kubernetes deployment configuration
- `devops-engineering-docs` — architecture and operational documentation

## Getting started

Runtime requirements, local setup, database migrations, API documentation, and testing instructions will be added when the backend stack is initialized..

## Stack

- Bun runtime
- Hono HTTP framework
- MongoDB
- Zod request validation
- Bun test runner

## Local development

```bash
cp .env.example .env
bun install
bun run dev
```

The API runs at `http://localhost:3000`. MongoDB is seeded with demo restaurants and menu items when the collections are empty.

## API routes

- `GET /health`
- `GET /api/restaurants`
- `GET /api/restaurants/:id/menu`
- `POST /api/orders`
- `GET /api/orders/:id`
- `POST /api/payments`
- `POST /api/payments/:id/confirm`
- `GET /api/dineout/restaurants`
- `POST /api/dineout/reservations`
- `GET /api/dineout/reservations/:id`

Payment endpoints are intentionally dummy-only and never charge real money.

## Tests

```bash
bun test
bun run typecheck
```

Automated tests use an in-memory store and do not need MongoDB credentials.
