# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Vite dev server with HMR
pnpm build        # Production build (runs tsc -b && vite build)
pnpm lint         # Run ESLint
pnpm preview      # Preview production build locally
```

No test framework is currently configured.

## Architecture

FairTrack is a personal finance tracking SPA built with React 19, TypeScript, and Vite (using the rolldown-vite fork).

### Key Technologies

- **UI**: MUI (Material UI) with Emotion styling, custom theme in `src/theme.ts`
- **State**: Zustand (`src/stores/useAuthStore.ts`) with localStorage persistence for auth
- **Server State**: @tanstack/react-query with custom hooks in `src/hooks/`
- **Routing**: react-router v7 with lazy-loaded components via `src/config/routeConfig.tsx`
- **API**: Custom fetch-based client (`src/api/client.ts`) using `credentials: "include"` for cookie-based auth
- **Package Manager**: pnpm

### Project Structure

```
src/
├── api/              # API functions organized by feature (auth, transactions, categories, profiles)
├── components/       # Shared UI components (Navbar, Footer, ConfirmDialog, Shimmer)
│   └── wrappers/    # Context providers (AuthContext)
├── config/           # Route configuration with lazy-loaded components
├── hooks/            # React Query hooks for data fetching
├── modules/          # Feature modules (each with its own components)
│   ├── auth/         # Login, SignUp, Logout, helpers
│   ├── transactions/ # TransactionList, TransactionForm, SummaryBar, TransactionRow
│   ├── categories/   # CategoryForm, CategoryItem, Categories
│   ├── profile/      # ProfileList, ProfileForm, ProfileItem, Profiles
│   ├── dashboard/    # Dashboard
│   ├── summary/      # Summary, StatsGrid, RecentTransactionsList, CurrentBalanceCard
│   └── home/         # Home page
├── stores/           # Zustand stores (useAuthStore)
├── types/            # TypeScript interfaces (api.ts, IUser.ts)
├── utils/            # Constants and utility functions
├── App.tsx           # Root layout with Navbar, Outlet, Footer
├── routes.tsx        # BrowserRouter with AuthContext wrapper
└── main.tsx          # Entry point
```

### Routing Pattern

All routes are defined in `src/config/routeConfig.tsx` using a nested `RouteConfig` array. Components are lazy-loaded with `React.lazy()`. The `App` component renders an `Outlet` for child routes and redirects `/` to `/transactions`.

### API Pattern

- Base API URL configured via `VITE_API_URL` env variable (default: `http://localhost:3001/api`)
- `src/api/client.ts` exports `apiClient` with methods: `get`, `post`, `put`, `patch`, `delete`
- API functions in `src/api/*.ts` call the client methods
- Custom hooks in `src/hooks/*.ts` wrap API calls with React Query

### Auth Flow

- Zustand store (`useAuthStore`) persists user/token to localStorage
- `AuthContext` wrapper in `src/components/wrappers/` provides auth context
- API requests include credentials (cookies) via `credentials: "include"`

### Responsive Design

- Navbar switches between desktop top nav and mobile bottom navigation (breakpoint: 600px)
- Bottom nav shows on mobile via `useMediaQuery('(max-width:600px)')`
