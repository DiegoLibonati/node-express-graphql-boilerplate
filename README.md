# Node Ts Express GraphQL Boilerplate

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started

> **Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed.

1. Clone the repository
2. Navigate to the project folder
3. Copy the environment file and fill in the values.
4. Build the Docker image: `docker-compose -f dev.docker-compose.yml build --no-cache`
5. Start the container: `docker-compose -f dev.docker-compose.yml up --force-recreate`

The API will be available at `http://localhost:5050/graphql`.

## Description

**Node Ts Express GraphQL Boilerplate** is a production-ready starting point for building GraphQL APIs with Node.js, Express, and TypeScript. It is not a framework or a library — it is the foundation you clone once and stop rebuilding from scratch on every new backend project.

**The problem it solves:** every Node.js + Express + TypeScript project starts with the same repetitive decisions — how to structure folders, how to wire up middleware, where to put types, how to handle environment variables safely, and how to configure linting and formatting so they actually block bad code before it reaches the repo. This boilerplate answers all of those decisions upfront, with a consistent, lightweight architecture that scales to real applications without introducing unnecessary complexity.

**What it includes:**

- **Express 4 + GraphQL 16 + TypeScript 5** — strict typing enforced throughout, with `NodeNext` module resolution and path aliases (`@/`) for readable imports.
- **graphql-http** — the GraphQL endpoint is mounted at `/graphql` using the spec-compliant `graphql-http` handler. No Apollo Server, no extra runtime dependencies.
- **Built-in GraphiQL** — a self-hosted GraphiQL playground is served at `/graphiql` directly from Express, so you can explore and test the schema without any external tool.
- **External API integration** — the resolver layer fetches data from an external REST API via Axios, using a configurable `API_URL`. The `User` model with a nested `Company` type is included as a reference implementation for queries and mutations.
- **Docker-first workflow** — separate `Dockerfile.development` and `Dockerfile.production`, plus `dev.docker-compose.yml`. The dev container mounts the source with hot-reload via `tsx watch`; the production image runs a compiled, pruned build.
- **Layered architecture** — clear separation between Schemas/Types (GraphQL SDL), Resolvers (business logic), and the app wiring. Each layer has a single responsibility and depends only on the layer below it.
- **Environment configuration** — variables are read and composed into a typed `Envs` object at startup. Crashes fast with a clear message if any required variable is missing.
- **Centralized error handling** — `errorHandler` and `notFoundHandler` middlewares catch unhandled errors and missing routes consistently.
- **Health check endpoint** — `GET /health` returns `{ status: "ok" }` for container orchestration and uptime monitoring.
- **Jest + Supertest** — test suite configured with `ts-jest`, covering schemas, resolvers, middlewares, helpers, and configs, with path alias mapping so tests import from `@/` just like source files.
- **ESLint + Prettier + Husky + lint-staged** — pre-commit hooks block commits with linting errors and auto-format staged files. No manual formatting steps required.

**How to use it:**

1. Clone the repository and fill in your `.env` from `.env.example`.
2. Start the stack with Docker Compose.
3. Replace the `User` schema, types, and resolvers with your own domain logic — the folder structure, middleware setup, error handling, and tooling stay exactly as they are.

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
"express": "^4.21.0"
"graphql": "^16.10.0"
"graphql-http": "^1.22.4"
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
"prettier": "^3.0.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Available Scripts

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start development server         |
| `npm run build`         | Build for production             |
| `npm run start`         | Start production server          |
| `npm run type-check`    | Run TypeScript type checking     |
| `npm run test`          | Run tests                        |
| `npm run test:watch`    | Run tests in watch mode          |
| `npm run test:coverage` | Run tests with coverage          |
| `npm run lint`          | Check for linting errors         |
| `npm run lint:fix`      | Fix linting errors               |
| `npm run lint:all`      | Fix linting errors (src + tests) |
| `npm run format`        | Format code with Prettier        |
| `npm run format:check`  | Check code formatting            |
| `npm run format:all`    | Format code (src + tests)        |

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/node-ts-express-graphql-boilerplate`](https://www.diegolibonati.com.ar/#/project/node-ts-express-graphql-boilerplate)

## Testing

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Production

The production setup uses a **multi-stage Docker build** to produce a lean, secure image:

1. **Builder stage** — installs all dependencies, compiles TypeScript (`npm run build`), resolves path aliases with `tsc-alias`, then prunes devDependencies.
2. **Runner stage** — copies only `dist/`, `node_modules/` (prod-only), and `package.json` from the builder. Runs as a non-root user (`appuser`) for security.

To build and start the production container:

```bash
docker-compose -f prod.docker-compose.yml build --no-cache
docker-compose -f prod.docker-compose.yml up --force-recreate
```

The API will be available at `http://localhost:5050/graphql`.

**Key differences from development:**

|              | Development                                  | Production                         |
| ------------ | -------------------------------------------- | ---------------------------------- |
| Dockerfile   | `Dockerfile.development`                     | `Dockerfile.production`            |
| Compose file | `dev.docker-compose.yml`                     | `prod.docker-compose.yml`          |
| Source mount | Volume-mounted with hot-reload (`tsx watch`) | Compiled `dist/` — no source mount |
| Dependencies | All (dev + prod)                             | Production only (devDeps pruned)   |
| `NODE_ENV`   | `development`                                | `production`                       |
| User         | root                                         | `appuser` (non-root)               |

## Env Keys

| Key                   | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `PORT`                | Port the HTTP server listens on.                                       |
| `NODE_ENV`            | Runtime environment (`development`, `production`, `test`).             |
| `BASE_URL`            | Base URL of the API (optional, used in production log output).         |
| `API_URL`             | Base URL of the external REST API the resolvers fetch from.            |
| `CHOKIDAR_USEPOLLING` | Enable polling for file watching (`true`/`false`). Required on Docker. |
| `CHOKIDAR_INTERVAL`   | Polling interval in milliseconds (e.g. `100`).                         |

```bash
# Server
PORT=5050
NODE_ENV=development
BASE_URL=

# Redirect
API_URL=https://jsonplaceholder.typicode.com

# Hot Reload docker
CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=100
```

## Project Structure

```
node-ts-express-graphql-boilerplate/
├── __tests__/                                    # Test suite
│   ├── __mocks__/
│   │   └── users.mock.ts                         # Shared mock User object
│   ├── configs/
│   │   └── env.config.test.ts
│   ├── constants/
│   │   ├── codes.constant.test.ts
│   │   └── messages.constant.test.ts
│   ├── helpers/
│   │   └── require_env.helper.test.ts
│   ├── middlewares/
│   │   ├── error_handler.middleware.test.ts
│   │   └── not_found_handler.middleware.test.ts
│   ├── resolvers/
│   │   ├── mutation.resolver.test.ts
│   │   └── query.resolver.test.ts
│   ├── schemas/
│   │   ├── types/
│   │   │   ├── company.type.test.ts
│   │   │   ├── create_user_input.type.test.ts
│   │   │   ├── root_mutation.type.test.ts
│   │   │   ├── root_query.type.test.ts
│   │   │   └── user.type.test.ts
│   │   └── schema.test.ts
│   └── jest.setup.ts                             # Global Jest setup (timeout)
├── src/
│   ├── configs/
│   │   └── env.config.ts                         # Reads and composes environment variables
│   ├── constants/
│   │   ├── codes.constant.ts                     # Response code strings
│   │   └── messages.constant.ts                  # Response message strings
│   ├── helpers/
│   │   └── require_env.helper.ts                 # Throws if a required env variable is missing
│   ├── middlewares/
│   │   ├── error_handler.middleware.ts            # Catches unhandled errors
│   │   └── not_found_handler.middleware.ts        # Returns 404 for unmatched routes
│   ├── resolvers/
│   │   ├── mutation.resolver.ts                   # Mutation resolver (createUser)
│   │   └── query.resolver.ts                      # Query resolver (users, user)
│   ├── schemas/
│   │   ├── types/
│   │   │   ├── company.type.ts                    # CompanyType GraphQL object
│   │   │   ├── create_user_input.type.ts          # CreateUserInput GraphQL input
│   │   │   ├── root_mutation.type.ts              # RootMutation type (entry point for mutations)
│   │   │   ├── root_query.type.ts                 # RootQuery type (entry point for queries)
│   │   │   └── user.type.ts                       # UserType GraphQL object
│   │   └── schema.ts                              # GraphQLSchema built from query + mutation roots
│   ├── types/
│   │   ├── app.ts                                 # Env union type + User interface
│   │   ├── args.ts                                # Resolver argument interfaces (UserArgs, CreateUserArgs)
│   │   ├── constants.ts                           # Types for code/message constant maps
│   │   ├── env.ts                                 # Envs interface
│   │   ├── inputs.ts                              # CreateUserInput interface
│   │   └── responses.ts                           # Response wrapper types (DefaultResponse, ResponseWithData)
│   ├── app.ts                                     # Express app setup (middleware + GraphQL handler + GraphiQL)
│   └── server.ts                                  # HTTP server bootstrap + graceful shutdown
├── .env.example                                   # Environment variable template
├── dev.docker-compose.yml                         # Development stack
├── prod.docker-compose.yml                        # Production stack
├── Dockerfile.development                         # Dev image (tsx watch + hot reload)
├── Dockerfile.production                          # Production image (multi-stage build)
├── eslint.config.js                               # ESLint flat config
├── jest.config.js                                 # Jest configuration
├── tsconfig.base.json                             # Shared TypeScript base config
├── tsconfig.app.json                              # App build config
├── tsconfig.test.json                             # Test config
└── tsconfig.json                                  # Project references root
```

| Folder / File        | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `__tests__/`         | Test files mirroring the `src/` structure, plus global Jest setup   |
| `src/configs/`       | Environment validation and composition into a typed `Envs` object   |
| `src/constants/`     | Centralized response codes and messages                             |
| `src/helpers/`       | Pure utility functions with no side effects                         |
| `src/middlewares/`   | Express middleware for error handling and 404s                      |
| `src/resolvers/`     | GraphQL resolver functions; each calls the external API via Axios   |
| `src/schemas/`       | GraphQL schema definition: types, input types, and the root schema  |
| `src/schemas/types/` | One file per GraphQL type (`UserType`, `CompanyType`, input, roots) |
| `src/types/`         | TypeScript interfaces and types, split by concern                   |

## Architecture & Design Patterns

### Layered Architecture

The project is organized into discrete layers, each with a single responsibility:

```
HTTP Request
     │
     ▼
Express + graphql-http          ← transport layer (app.ts)
     │
     ▼
GraphQL Schema & Types          ← schema definition (src/schemas/)
     │
     ▼
Resolvers                       ← business logic + data fetching (src/resolvers/)
     │
     ▼
External REST API (Axios)       ← data source
```

No layer reaches past its immediate neighbor. Types and schemas define the shape; resolvers own the logic; the app wires everything together.

---

### Code-First GraphQL

Types are defined programmatically using the `graphql` JS library (`GraphQLObjectType`, `GraphQLInputObjectType`, etc.) rather than with SDL strings. This keeps types fully type-checked by TypeScript and colocated with the resolver wiring, with no code-generation step required.

---

### Resolver / Schema Separation

Type definitions (`src/schemas/types/`) and resolver functions (`src/resolvers/`) live in separate files. The root types (`RootQueryType`, `RootMutationType`) act as the single wiring point that connects each field to its resolver. Resolver files contain only async logic — no GraphQL primitives.

---

### External API as Data Source

Resolvers do not own a database. They delegate all data operations to an external REST API via Axios, configured through `API_URL`. This makes the data layer swappable: replace the Axios calls in the resolvers with any database client or ORM without touching the schema or app setup.

---

### Fail-Fast Initialization

`requireEnv` (`src/helpers/require_env.helper.ts`) throws synchronously at module load time if a required environment variable is missing. The process never starts in a partially-configured state.

---

### Centralized Error Handling

All unhandled errors flow to `errorHandler` and all unmatched routes to `notFoundHandler`. Controllers and resolvers never write error responses directly — they throw, and the middleware layer handles the shape and status code uniformly.

---

### Graceful Shutdown

`server.ts` registers `SIGTERM` and `SIGINT` handlers. On signal, the HTTP server stops accepting new connections and drains in-flight requests. A 10-second hard timeout forces exit if draining stalls, preventing zombie containers.

---

### Multi-Stage Docker Build

The production image uses a two-stage build:

- **Builder** — full Node image, compiles TypeScript, resolves path aliases, prunes devDependencies.
- **Runner** — minimal Alpine image, copies only `dist/`, `node_modules/` (prod-only), and `package.json`. Runs as a non-root user (`appuser`) for least-privilege security.

This keeps the final image small and free of build tooling.

## Code Quality Tools

### ESLint

Configured with TypeScript strict rules (`strictTypeChecked` + `stylisticTypeChecked`):

- Explicit return types required on all functions
- No `any` type allowed
- Consistent type imports enforced (`import type`)
- Interfaces preferred over type aliases
- No unused variables (args prefixed with `_` are exempt)
- `const` required — `var` is an error, `let` only when reassignment is needed
- `===` required — no loose equality
- `console` usage warns; `debugger` is an error
- Config files (`*.config.js`) opt out of type-checked rules (not included in any `tsconfig`)
- Relaxed rules inside `__tests__/` to allow `any`, unsafe assertions, and `no-console`

### Prettier

Automatic code formatting on save and on commit:

- 2 spaces indentation
- Semicolons required
- Double quotes
- Trailing commas (all)
- Arrow function parentheses always included
- Bracket spacing enabled
- Max line width: 100 characters
- LF line endings

### Husky + lint-staged

Pre-commit hooks that automatically:

- Run ESLint with auto-fix on staged `.ts` files
- Format `.ts`, `.json`, and `.md` files with Prettier
- Block commits with linting errors

## Security

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

Fix vulnerabilities automatically (when a safe upgrade exists):

```bash
npm audit fix
```

## Known Issues

None at the moment.
