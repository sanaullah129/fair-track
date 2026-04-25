# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm install` - Install dependencies (project uses pnpm@10.27.0)
- `pnpm build` - Compile TypeScript to JavaScript (`npx tsc`, output to `dist/`)
- `pnpm dev` - Start development server with nodemon (`nodemon src/index.ts`)
- `pnpm start` - Run compiled server (`node dist/index.js`)
- No test framework is currently configured.

## Architecture

Fair-track is an Express + MongoDB (Mongoose) REST API server for expense/income tracking.

### Layered Structure

Requests flow: **Routes → Middlewares → Controllers → Repositories → Models**

- **Routes** (`src/routes/`) - Express route definitions, mount under `/api` prefix (configurable via `API_PREFIX` env var)
- **Middlewares** (`src/middlewares/`) - Per-resource folders with validation, auth (`auth.middleware.ts`), and audit logging (`audit.middleware.ts`)
- **Controllers** (`src/controllers/`) - Business logic, calls repositories
- **Repositories** (`src/repositories/`) - Database access layer, wraps Mongoose models
- **Models** (`src/models/`) - Mongoose schemas: User, Profile, Category, Transaction, Summary (+ `Base.model.ts`, `IModels.ts` for shared interfaces)

### Key Files

- `src/index.ts` - Entry point, creates Server instance
- `src/Server.ts` - Express app setup: DB connection, middleware, routes, error handling
- `src/router.ts` - Top-level route mounting (`/user`, `/category`, `/transaction`, `/profile`, `/summary`, `/health`)
- `src/configs/envConfig.ts` - Environment config via dotenv (see `.env.example`)
- `src/configs/loggerConfig.ts` - Pino logger setup
- `src/helpers/jwt.ts` - JWT token generation/verification (token stored in HTTP-only cookie `token`)
- `src/middlewares/auth.middleware.ts` - Verifies JWT from cookie, attaches `req.user` (extends Express Request type)

### Configuration

Copy `.env.example` to `.env`. Key variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `BCRYPT_ROUNDS`.

### TypeScript

- Target: NodeNext module system with NodeNext module resolution
- Output: `dist/` directory
- Source: `src/` directory
- No `.js` extensions in imports (project uses TypeScript paths without ESM file extensions)

### API Documentation

Swagger/OpenAPI is configured in `src/configs/swaggerConfig.ts` but currently **disabled** (commented out in `Server.ts` line 29). Uncomment `this.setUpSwagger()` to enable at `/api-docs`.
