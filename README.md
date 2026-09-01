# Node.js + Express + TypeScript GraphQL Boilerplate

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**node-express-graphql-boilerplate** is a production-ready starting point for building GraphQL APIs with Node.js, Express, and TypeScript. It is not a framework or a library — it is the foundation you clone once and stop rebuilding from scratch on every new backend project.

**The problem it solves:** every Node.js + Express + TypeScript project starts with the same repetitive decisions — how to structure folders, how to wire up middleware, where to put types, how to validate environment variables, how to ship security headers, how to add request logging and rate limiting, and how to configure linting/formatting so they actually block bad code before it reaches the repo. This boilerplate answers all of those decisions upfront, with a consistent, lightweight architecture that scales to real applications without introducing unnecessary complexity.

**What it includes:**

- **Express 4 + GraphQL 16 + TypeScript 5** — strict typing enforced throughout, with `NodeNext` module resolution and path aliases (`@/`) for readable imports.
- **graphql-http** — the GraphQL endpoint is mounted at `/api/v1/graphql` using the spec-compliant `graphql-http` handler. No Apollo Server, no extra runtime dependencies.
- **Built-in GraphiQL via ruru** — a self-hosted GraphiQL playground is served at `/api/v1/graphiql` directly from Express, gated by `GRAPHIQL_ENABLED` (off by default in production).
- **Versioned routes** — all HTTP surface lives under `/api/v1/...`, with a single composition point in `src/routes/index.ts` so new versions can be added without touching the app wiring.
- **External API integration** — resolvers fetch data from an external REST API through a configured `httpClient` (Axios instance) with `API_URL` baseURL and `HTTP_TIMEOUT_MS` timeout. A `User` model with a nested `Company` type is included as a reference implementation.
- **Zod-based environment validation** — variables are parsed and coerced with Zod at startup. The process crashes fast with a list of issues if any required variable is missing or malformed. `GRAPHIQL_ENABLED` and `GRAPHQL_INTROSPECTION` default off in production and on in dev/test.
- **Cascading `.env` files** — before Zod validation, `src/configs/dotenv.config.ts` loads `.env.<mode>.local`, `.env.local`, `.env.<mode>` and `.env` (in that precedence order) without ever overriding real environment variables, so `npm run dev` / `npm start` work without Docker while the Docker `env_file` flow stays untouched. Under `NODE_ENV=test` only `.env.test.local` / `.env.test` are read.
- **Security headers (helmet)** — sensible defaults are applied to every response (CSP, HSTS, X-Content-Type-Options, etc.), plus `x-powered-by` is disabled.
- **Rate limiting (express-rate-limit)** — configurable window and max via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX`. Setting `RATE_LIMIT_MAX=0` bypasses the limiter with a passthrough middleware.
- **Structured logging (pino + pino-http)** — JSON logs in production, pretty-printed in development. Per-request logs include the request id propagated via the `x-request-id` header.
- **Request id middleware** — every request gets an `x-request-id` header. The middleware reuses an incoming header if present, otherwise generates a UUID, and exposes it as `req.id` for downstream use.
- **AppError hierarchy** — `AppError` is the base custom error with `status` and `code`. `BadRequestError`, `UnauthorizedError`, `NotFoundError`, and `ConflictError` extend it. The error handler maps any `AppError` subclass to its declared status; everything else falls back to `500` with the generic code.
- **Docker-first workflow** — separate `Dockerfile.development` and `Dockerfile.production`, plus `dev.docker-compose.yml`. The dev container mounts the source with hot-reload via `tsx watch`. The production image is a multi-stage build with a non-root user and a `HEALTHCHECK` that pings `/api/v1/health/live`.
- **Layered architecture** — transport (app + routes), HTTP handlers (controllers), business logic (resolvers/services), schema definition (schemas), and infrastructure (configs, middlewares, errors, helpers). Each layer has a single responsibility and depends only on the layer below it.
- **Health check endpoints** — `GET /api/v1/health/live` and `GET /api/v1/health/ready` return `{ code, message, data }` for container orchestration and uptime monitoring.
- **Jest + Supertest** — full test suite configured with `ts-jest`, covering controllers, routes, resolvers, schemas, middlewares, errors, helpers, and configs. Coverage threshold is 70% across statements, branches, functions, and lines.
- **ESLint + Prettier + Husky + lint-staged** — pre-commit hooks block commits with linting errors and auto-format staged files. No manual formatting steps required.
- **Editor & toolchain consistency** — `.editorconfig`, `.nvmrc`, `.npmrc`, and `.vscode/extensions.json` keep encoding, line endings, Node version, and recommended VS Code extensions aligned across machines.

**How to use it:** clone the repo, fill in your `.env`, start the stack with Docker Compose, and replace the `User` schema, types, and resolvers with your own domain logic. The folder structure, middleware setup, error handling, and tooling stay exactly as they are. Setup steps are detailed in [Getting Started](#getting-started).

## Technologies Used

1. Node.js
2. TypeScript
3. Express
4. GraphQL
5. Docker

## Libraries Used

### Dependencies

```
"axios": "^1.7.9"
"dotenv": "^17.4.2"
"express": "^4.21.0"
"express-rate-limit": "^8.5.2"
"graphql": "^16.10.0"
"graphql-http": "^1.22.4"
"helmet": "^8.1.0"
"pino": "^10.3.1"
"pino-http": "^11.0.0"
"ruru": "^2.0.0"
"zod": "^4.4.3"
```

### DevDependencies

```
"@eslint/js": "^9.0.0"
"@types/express": "^5.0.0"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0"
"@types/supertest": "^6.0.2"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.0.0"
"globals": "^15.0.0"
"husky": "^9.0.0"
"jest": "^30.0.0"
"lint-staged": "^15.0.0"
"pino-pretty": "^13.1.3"
"prettier": "^3.0.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Getting Started

> **Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed. The Node version pinned in `.nvmrc` is also recommended if you run the server outside Docker.

1. Clone the repository.
2. Navigate to the project folder.
3. Copy the environment template and fill in the values:
   ```bash
   cp .env.example .env
   ```
   See [Env Keys](#env-keys) for the full reference.
4. Build the Docker image:
   ```bash
   docker-compose -f dev.docker-compose.yml build --no-cache
   ```
5. Start the container:
   ```bash
   docker-compose -f dev.docker-compose.yml up --force-recreate
   ```

The API will be available at `http://localhost:5050/api/v1/graphql` and the GraphiQL playground at `http://localhost:5050/api/v1/graphiql`.

If you prefer to run the dev server outside Docker, use:

```bash
npm install
npm run dev
```

This boots the server with `tsx watch` for hot reload. No `--env-file` flag or wrapper is needed: `src/configs/dotenv.config.ts` reads the `.env` cascade before the Zod schema is evaluated, so the same `.env` you would feed to Docker works out of the box. The startup log includes an `envFiles` field listing which files were actually applied.

### `.env` file cascade

Environment sources are applied in this precedence order (highest wins):

1. Real environment variables (`process.env`: Docker `env_file`, CI, shell exports).
2. `.env.<NODE_ENV>.local`
3. `.env.local`
4. `.env.<NODE_ENV>`
5. `.env`

A key from a file is only applied if it is not already set, so the Docker flow — where Compose injects everything via `env_file` — behaves exactly as before. `NODE_ENV` itself is resolved from the process first, then from a `NODE_ENV` declared inside `.env.local` or `.env`, and defaults to `development`.

**Test isolation:** when `NODE_ENV=test` (e.g. under Jest) only `.env.test.local` and `.env.test` are read. A local development `.env` can never change test results.

### Pre-Commit for Development

Code quality is enforced automatically through pre-commit hooks. Husky runs `lint-staged` on every commit, which:

- Runs ESLint with auto-fix on staged `.ts` files.
- Formats `.ts`, `.json`, and `.md` files with Prettier.
- Blocks commits with linting errors.

Available manual commands:

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run type-check`   | Run TypeScript type checking     |
| `npm run lint`         | Check for linting errors         |
| `npm run lint:fix`     | Fix linting errors               |
| `npm run lint:all`     | Fix linting errors (src + tests) |
| `npm run format`       | Format code with Prettier        |
| `npm run format:check` | Check code formatting            |
| `npm run format:all`   | Format code (src + tests)        |

**ESLint** is configured with TypeScript strict rules (`strictTypeChecked` + `stylisticTypeChecked`):

- Explicit return types required on all functions.
- No `any` type allowed.
- Consistent type imports enforced (`import type`).
- Interfaces preferred over type aliases.
- No unused variables (args prefixed with `_` are exempt).
- `const` required — `var` is an error, `let` only when reassignment is needed.
- `===` required — no loose equality.
- `console` usage warns; `debugger` is an error.
- `require()` calls are forbidden — use `import` or `jest.requireActual`/`jest.requireMock` in tests.
- Config files (`*.config.js`) opt out of type-checked rules (not included in any `tsconfig`).
- Relaxed rules inside `__tests__/` to allow `any`, unsafe assertions, and `no-console`.

**Prettier** applies the following style:

- 2 spaces indentation.
- Semicolons required.
- Double quotes.
- Trailing commas (all).
- Arrow function parentheses always included.
- Bracket spacing enabled.
- Max line width: 100 characters.
- LF line endings.

## Env Keys

The app reads environment variables at startup and validates them with Zod, composing them into a typed `Envs` object. Missing or malformed variables crash the process with a list of issues. Values can come from the real environment (Docker `env_file`, CI, shell) or from the [`.env` file cascade](#env-file-cascade) — real environment variables always win.

| Key                     | Type    | Default            | Description                                                                                |
| ----------------------- | ------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `PORT`                  | number  | `5050`             | Port the HTTP server listens on.                                                           |
| `NODE_ENV`              | enum    | `development`      | Runtime environment (`development` \| `production` \| `test`).                             |
| `BASE_URL`              | string  | `""`               | Base URL of the API (optional, used in production log output).                             |
| `API_URL`               | url     | _required_         | Base URL of the external REST API the resolvers fetch from. Must be a valid URL.           |
| `HTTP_TIMEOUT_MS`       | number  | `5000`             | Timeout (ms) applied to the upstream Axios client.                                         |
| `RATE_LIMIT_WINDOW_MS`  | number  | `60000`            | Rate-limit window length (ms).                                                             |
| `RATE_LIMIT_MAX`        | number  | `100`              | Max requests per window. `0` disables the limiter (passthrough).                           |
| `GRAPHIQL_ENABLED`      | boolean | `true` in non-prod | Mount `/api/v1/graphiql`. Defaults to `false` when `NODE_ENV=production`.                  |
| `GRAPHQL_INTROSPECTION` | boolean | `true` in non-prod | Allow schema introspection. Defaults to `false` when `NODE_ENV=production`.                |
| `LOG_LEVEL`             | enum    | `info`             | Pino log level (`fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace` \| `silent`). |
| `BODY_LIMIT`            | string  | `1gb`              | JSON / urlencoded body size limit (e.g. `100kb`, `1mb`, `1gb`).                            |
| `SEED_DEFAULT_DATA`     | boolean | `false`            | Toggle to seed default data on startup.                                                    |
| `CHOKIDAR_USEPOLLING`   | boolean | —                  | Enable polling for file watching. Required on Docker.                                      |
| `CHOKIDAR_INTERVAL`     | number  | —                  | Polling interval in milliseconds (e.g. `100`).                                             |

Example `.env`:

```bash
# Server
PORT=5050
NODE_ENV=development
BASE_URL=
SEED_DEFAULT_DATA=false

# Logging (fatal | error | warn | info | debug | trace | silent)
LOG_LEVEL=info

# JSON / urlencoded body size limit (e.g. 100kb, 1mb, 1gb)
BODY_LIMIT=1gb

# Redirect
API_URL=https://jsonplaceholder.typicode.com

# Upstream HTTP client
HTTP_TIMEOUT_MS=5000

# Rate limit (on /graphql)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

# Dev tooling — defaults to on only when NODE_ENV != "production"
GRAPHIQL_ENABLED=true
GRAPHQL_INTROSPECTION=true

# Hot Reload docker
CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=100
```

## Project Structure

```
node-express-graphql-boilerplate/
├── __tests__/                                       # Test suite (mirrors src/)
│   ├── __mocks__/
│   │   ├── envs.mock.ts                             # Shared env mock values
│   │   └── users.mock.ts                            # Shared mock User object
│   ├── configs/
│   │   ├── dotenv.config.test.ts
│   │   ├── env.config.test.ts
│   │   ├── http_client.config.test.ts
│   │   └── logger.config.test.ts
│   ├── constants/
│   ├── controllers/
│   │   ├── graph.controller.test.ts
│   │   ├── graph.controller.introspection_disabled.test.ts
│   │   └── health.controller.test.ts
│   ├── errors/
│   │   ├── app.error.test.ts
│   │   ├── bad_request.error.test.ts
│   │   ├── conflict.error.test.ts
│   │   ├── not_found.error.test.ts
│   │   └── unauthorized.error.test.ts
│   ├── helpers/
│   │   └── get_exception_message.helper.test.ts
│   ├── middlewares/
│   │   ├── error_handler.middleware.test.ts
│   │   ├── not_found_handler.middleware.test.ts
│   │   ├── rate_limit.middleware.test.ts
│   │   └── request_id.middleware.test.ts
│   ├── resolvers/
│   ├── routes/v1/
│   │   ├── graph.route.test.ts
│   │   ├── graph.route.graphiql_disabled.test.ts
│   │   └── health.route.test.ts
│   ├── schemas/
│   ├── jest.env.ts                                  # Pre-framework env setup (setupFiles)
│   └── jest.setup.ts                                # Post-framework setup (setupFilesAfterEnv)
├── src/
│   ├── configs/
│   │   ├── dotenv.config.ts                         # Cascading .env file loader (never overrides process.env)
│   │   ├── env.config.ts                            # Zod-validated environment composition
│   │   ├── http_client.config.ts                    # Axios instance with API_URL + timeout
│   │   └── logger.config.ts                         # Pino logger (pretty in dev, JSON in prod)
│   ├── constants/
│   │   ├── codes.constant.ts                        # Response code strings
│   │   └── messages.constant.ts                     # Response message strings
│   ├── controllers/
│   │   ├── graph.controller.ts                      # GraphQL + GraphiQL HTTP handlers
│   │   └── health.controller.ts                     # /health/live + /health/ready handlers
│   ├── errors/
│   │   ├── app.error.ts                             # Base AppError (status + code)
│   │   ├── bad_request.error.ts                     # 400
│   │   ├── conflict.error.ts                        # 409
│   │   ├── not_found.error.ts                       # 404 (with defaults)
│   │   └── unauthorized.error.ts                    # 401
│   ├── helpers/
│   │   └── get_exception_message.helper.ts          # Maps any error to { status, code, message }
│   ├── middlewares/
│   │   ├── error_handler.middleware.ts              # Centralized error handler (uses AppError)
│   │   ├── not_found_handler.middleware.ts          # 404 for unmatched routes
│   │   ├── rate_limit.middleware.ts                 # express-rate-limit + passthrough when MAX=0
│   │   └── request_id.middleware.ts                 # x-request-id reuse / UUID generation
│   ├── resolvers/
│   │   ├── mutation.resolver.ts                     # Mutation resolver (createUser)
│   │   └── query.resolver.ts                        # Query resolver (users, user)
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── graph.route.ts                       # /graphql (+ /graphiql when enabled)
│   │   │   └── health.route.ts                      # /health/live + /health/ready
│   │   └── index.ts                                 # v1 composition point
│   ├── schemas/
│   │   ├── types/                                   # GraphQL object/input types
│   │   │   ├── company.type.ts
│   │   │   ├── create_user_input.type.ts
│   │   │   ├── root_mutation.type.ts
│   │   │   ├── root_query.type.ts
│   │   │   └── user.type.ts
│   │   └── schema.ts                                # GraphQLSchema (query + mutation roots)
│   ├── types/
│   │   ├── app.ts                                   # Env + LogLevel unions, User, ValidateConfig
│   │   ├── args.ts                                  # Resolver argument interfaces
│   │   ├── constants.ts                             # Types for code/message constant maps
│   │   ├── env.ts                                   # Envs interface
│   │   ├── helpers.ts                               # ExceptionInfo
│   │   ├── inputs.ts                                # CreateUserInput
│   │   └── responses.ts                             # Response wrapper types
│   ├── app.ts                                       # Express app setup (security, logging, routes)
│   └── server.ts                                    # HTTP server bootstrap + graceful shutdown
├── .github/workflows/ci.yml                         # GitHub Actions CI (lint+audit, tests, docker build)
├── .editorconfig                                    # Editor settings (encoding, indent, EOL)
├── .env.example                                     # Environment variable template
├── .npmrc                                           # npm settings
├── .nvmrc                                           # Pinned Node version
├── .vscode/extensions.json                          # Recommended VS Code extensions
├── dev.docker-compose.yml                           # Development stack
├── prod.docker-compose.yml                          # Production stack
├── Dockerfile.development                           # Dev image (tsx watch + hot reload)
├── Dockerfile.production                            # Multi-stage build, non-root, HEALTHCHECK
├── eslint.config.js                                 # ESLint flat config
├── jest.config.js                                   # Jest configuration
├── package-lock.json                                # Tracked lockfile
├── tsconfig.base.json                               # Shared TypeScript base config
├── tsconfig.app.json                                # App build config
├── tsconfig.test.json                               # Test config
└── tsconfig.json                                    # Project references root
```

| Folder / File        | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `__tests__/`         | Test files mirroring the `src/` structure, plus pre/post-framework setup      |
| `src/configs/`       | Zod-validated env composition, Axios http client, Pino logger                 |
| `src/constants/`     | Centralized response codes and messages                                       |
| `src/controllers/`   | HTTP handlers — turn requests into service/resolver calls and shape responses |
| `src/errors/`        | `AppError` base class plus 400/401/404/409 specializations                    |
| `src/helpers/`       | Pure utility functions (e.g. exception → status/code/message mapping)         |
| `src/middlewares/`   | Cross-cutting Express middleware (errors, 404, rate limit, request id)        |
| `src/resolvers/`     | GraphQL resolver functions; each calls the external API via the http client   |
| `src/routes/`        | Express routers grouped by API version (`v1/`) and composed in `index.ts`     |
| `src/schemas/`       | GraphQL schema definition: types, input types, and the root schema            |
| `src/schemas/types/` | One file per GraphQL type (`UserType`, `CompanyType`, input, roots)           |
| `src/types/`         | TypeScript interfaces and types, split by concern                             |

## Architecture & Design Patterns

The folder layout above maps directly to the layered design described here.

### Layered Architecture

The project is organized into discrete layers, each with a single responsibility:

```
HTTP Request
     │
     ▼
Express + middlewares           ← security, logging, rate limit, request id (app.ts)
     │
     ▼
Routes (versioned)              ← /api/v1/... (src/routes/)
     │
     ▼
Controllers                     ← HTTP handlers (src/controllers/)
     │
     ▼
GraphQL Schema & Types          ← schema definition (src/schemas/)
     │
     ▼
Resolvers                       ← business logic + data fetching (src/resolvers/)
     │
     ▼
httpClient (Axios) → External REST API
```

No layer reaches past its immediate neighbor. Types and schemas define the shape; resolvers own the logic; controllers handle the transport; routes wire URLs to handlers; the app composes the middleware stack.

---

### Code-First GraphQL

Types are defined programmatically using the `graphql` JS library (`GraphQLObjectType`, `GraphQLInputObjectType`, etc.) rather than with SDL strings. This keeps types fully type-checked by TypeScript and colocated with the resolver wiring, with no code-generation step required.

---

### Versioned Routes

All HTTP routes are mounted under `/api/v1/...` through a single composition file (`src/routes/index.ts`). New API versions (`v2/`, `v3/`) can be added side-by-side without touching the app wiring or existing routes.

---

### Resolver / Schema / Controller Separation

Type definitions (`src/schemas/types/`), resolver functions (`src/resolvers/`), and HTTP handlers (`src/controllers/`) live in separate files. The root types (`RootQueryType`, `RootMutationType`) act as the single wiring point that connects each GraphQL field to its resolver. Controllers stay thin — they delegate to schemas or to direct handlers (e.g. health checks).

---

### External API as Data Source

Resolvers do not own a database. They delegate all data operations to an external REST API through `httpClient` (a configured Axios instance with `API_URL` and `HTTP_TIMEOUT_MS`). This makes the data layer swappable: replace the calls with any database client or ORM without touching the schema, controllers, or app setup.

---

### Fail-Fast Initialization

`src/configs/env.config.ts` parses `process.env` with a Zod schema at module load. Right before that, `src/configs/dotenv.config.ts` applies the `.env` file cascade (without overriding variables already present in the environment), so any entry point that imports the config — the server, Jest, one-off scripts — gets the same resolution. If any required variable is missing or malformed, the process throws synchronously with a list of issues. The server never starts in a partially-configured state.

---

### Centralized Error Handling

Custom errors extend `AppError` (`status`, `code`, `message`). The `errorHandler` middleware maps any `AppError` subclass — `BadRequestError` (400), `UnauthorizedError` (401), `NotFoundError` (404), `ConflictError` (409) — to its declared status, and falls back to `500` with the generic code for anything else. Server-side errors (status ≥ 500) are logged through Pino with full context; client-side errors are not. Unmatched routes go through `notFoundHandler` and respond with the standard 404 shape.

---

### Security and Observability Middleware

The middleware stack applies, in order:

1. **`helmet`** — sets a sensible Content-Security-Policy and other security headers. `x-powered-by` is disabled.
2. **`pino-http`** — emits a structured log per request, tagged with the request id.
3. **`request_id`** — reuses an incoming `x-request-id` header or generates a UUID, then exposes it as `req.id`.
4. **`rateLimiter`** — enforces `RATE_LIMIT_MAX` requests per `RATE_LIMIT_WINDOW_MS`. Setting `RATE_LIMIT_MAX=0` swaps in a passthrough so local/dev environments are not throttled.
5. **`express.json` / `express.urlencoded`** — body parsing with a configurable `BODY_LIMIT`.

---

### Graceful Shutdown

`server.ts` registers `SIGTERM` and `SIGINT` handlers. On signal, the HTTP server stops accepting new connections and drains in-flight requests. A 10-second hard timeout forces exit if draining stalls, preventing zombie containers. Bootstrap logging goes through Pino, not `console`.

---

### Health Probes

`GET /api/v1/health/live` and `GET /api/v1/health/ready` return `200` with `{ code, message, data: null }`. The production Docker image runs a `HEALTHCHECK` against `/api/v1/health/live` every 30 seconds — Docker / Kubernetes will mark the container unhealthy if the probe fails.

## Testing

The project uses Jest with `ts-jest` and Supertest. Tests mirror the `src/` structure under `__tests__/` and import from `@/` via the same path aliases as source files. The 70% coverage threshold (statements, branches, functions, lines) is enforced.

| Command                 | Description             |
| ----------------------- | ----------------------- |
| `npm run test`          | Run the full test suite |
| `npm run test:watch`    | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

Coverage spans configs (dotenv cascade, env, http client, logger), constants, controllers, errors, helpers, middlewares (error handler, not found, rate limit, request id), resolvers, routes (Supertest integration), schemas, and the GraphQL types.

Two Jest hooks shape the test runtime:

- `__tests__/jest.env.ts` (registered via `setupFiles`) runs **before** the testing framework boots and seeds `process.env.API_URL` so any module that imports `env.config` at the top level (Zod-validated) can resolve.
- `__tests__/jest.setup.ts` (registered via `setupFilesAfterEnv`) runs after the framework boots and configures the global test timeout.

Module re-loading after environment changes uses `jest.resetModules()` + `jest.requireActual(...)` — `require()` is disallowed by ESLint.

## Security Audit

Before promoting a build, check the dependency tree for known vulnerabilities:

```bash
npm audit
```

Apply the available safe upgrades automatically:

```bash
npm audit fix
```

Resolve any remaining advisories manually before continuing to [Build](#build).

## Build

Once tests and the security audit pass, produce a compiled artifact:

```bash
npm run build
```

This compiles TypeScript into `dist/` and runs `tsc-alias` so path aliases (`@/`) are rewritten as relative imports, making the output runnable directly by Node without a custom loader.

To run the compiled server locally (outside Docker):

```bash
npm run start
```

The resulting `dist/` is what the production Docker image consumes — no build steps are repeated at runtime.

## Continuous Integration

The repository ships with a **GitHub Actions** pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs automatically on every `push` and `pull_request` targeting the `main` branch and is validation-only — it does not publish artifacts, packages, or releases.

### Pipeline overview

```
                      ┌─── PR or push to main ───┐
                      ▼                          ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│   lint-and-audit     │─▶│       test       │─▶│    docker-build      │
│ eslint · prettier ·  │  │ jest --runInBand │  │ Dockerfile.dev +     │
│ tsc --noEmit · audit │  │  (Supertest)     │  │ Dockerfile.prod      │
└──────────────────────┘  └──────────────────┘  └──────────────────────┘
```

Each job needs the previous one to succeed. The Node version is read from [`.nvmrc`](.nvmrc) via `actions/setup-node`, and the npm cache is reused across jobs.

### Validation jobs (run on every PR and push to `main`)

1. **`lint-and-audit`** — `npm ci`, then in order:
   - `npm run lint` (ESLint, strict TypeScript rules).
   - `npm run format:check` (Prettier).
   - `npm run type-check` (`tsc -p tsconfig.app.json --noEmit`).
   - `npm audit --audit-level=high` (fails on `high` or `critical` advisories).
2. **`test`** — `npm test` (Jest + Supertest, `--runInBand --verbose`). `API_URL` is injected as a job env var so the Zod-validated `env.config` boots cleanly. The 70% coverage threshold (statements, branches, functions, lines) is enforced from `jest.config.js`.
3. **`docker-build`** — smoke test that both `Dockerfile.development` and `Dockerfile.production` produce a tagged local image via Docker Buildx. The job uses a `matrix` to run the two builds in parallel:

   | Dockerfile               | Image tag  |
   | ------------------------ | ---------- |
   | `Dockerfile.development` | `app:dev`  |
   | `Dockerfile.production`  | `app:prod` |

   Images are `load`ed into the runner but never pushed to a registry.

### Where the build outputs live

| Output                                | Location                                  |
| ------------------------------------- | ----------------------------------------- |
| Lint, format, type-check, audit logs  | **Actions** tab on GitHub                 |
| Test logs (pass/fail per suite)       | **Actions** tab on GitHub                 |
| Docker images built by `docker-build` | Ephemeral, inside the runner (not pushed) |

> **Note:** the pipeline does not produce releases or attach artifacts. There is no GitHub Release, no published Docker image, and no version bumping — `docker-build` exists only to guarantee both Dockerfiles still build from the current source.

### Running the same checks locally

```bash
# lint-and-audit
npm ci
npm run lint
npm run format:check
npm run type-check
npm audit --audit-level=high

# test
npm test

# docker-build (smoke)
docker build -f Dockerfile.development -t app:dev .
docker build -f Dockerfile.production  -t app:prod .
```

### Skipping CI

To push a change without running the pipeline (e.g. typo-only doc tweaks), append GitHub's standard marker to the commit message:

```bash
git commit -m "docs: fix typo in README [skip ci]"
```

## Production

Production deploys assume the previous pipeline steps have already passed:

1. [Testing](#testing) is green.
2. [Security Audit](#security-audit) shows no unresolved advisories.
3. [Build](#build) succeeds locally (or inside the Docker builder stage).

What this section adds is **how to package and ship that build**: configuring a production `.env`, running the multi-stage Docker image, and distributing the container.

### Configure the production environment

Copy `.env.example` to `.env` and adjust the values for production:

```bash
cp .env.example .env
```

At minimum, set:

```bash
NODE_ENV=production
PORT=5050
BASE_URL=https://your-domain.example
API_URL=https://your-upstream-api.example
```

`GRAPHIQL_ENABLED` and `GRAPHQL_INTROSPECTION` automatically default to `false` when `NODE_ENV=production`. Override them explicitly only if you understand the exposure.

### Multi-stage Docker build

The production image uses a two-stage build:

- **Builder stage** — installs all dependencies, runs `npm run build` (see [Build](#build)), then prunes devDependencies.
- **Runner stage** — copies only `dist/`, `node_modules/` (prod-only), and `package.json`. Runs as a non-root user (`appuser`) for least-privilege security. A `HEALTHCHECK` polls `/api/v1/health/live` every 30 seconds.

This keeps the final image small and free of build tooling.

To build and start the production container:

```bash
docker-compose -f prod.docker-compose.yml build --no-cache
docker-compose -f prod.docker-compose.yml up --force-recreate
```

The API will be available at `http://localhost:5050/api/v1/graphql`.

### Dev vs Production

|               | Development                                  | Production                                  |
| ------------- | -------------------------------------------- | ------------------------------------------- |
| Dockerfile    | `Dockerfile.development`                     | `Dockerfile.production`                     |
| Compose file  | `dev.docker-compose.yml`                     | `prod.docker-compose.yml`                   |
| Source mount  | Volume-mounted with hot-reload (`tsx watch`) | Compiled `dist/` — no source mount          |
| Dependencies  | All (dev + prod)                             | Production only (devDeps pruned)            |
| `NODE_ENV`    | `development`                                | `production`                                |
| User          | root                                         | `appuser` (non-root)                        |
| Healthcheck   | none                                         | `HEALTHCHECK` against `/api/v1/health/live` |
| GraphiQL      | `/api/v1/graphiql` enabled                   | disabled by default                         |
| Introspection | enabled                                      | disabled by default                         |
| Logging       | Pino + `pino-pretty` (colorized)             | Pino (JSON)                                 |

## Known Issues

None at the moment.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/node-express-graphql-boilerplate`](https://www.diegolibonati.com.ar/#/project/node-express-graphql-boilerplate)
