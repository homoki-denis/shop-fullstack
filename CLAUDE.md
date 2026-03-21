# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (ShopApi)
```bash
cd ShopApi
dotnet run          # Run the API (listens on http://localhost:5015)
dotnet build        # Build only
dotnet ef migrations add <Name>   # Add a new EF Core migration
dotnet ef database update         # Apply pending migrations
```

### Frontend (shop-frontend)
```bash
cd shop-frontend
npm install         # Install dependencies
npm run dev         # Dev server at http://localhost:5173
npm run build       # Production build
npm run lint        # Run ESLint
```

### Docker (full stack)
```bash
docker-compose up --build   # Run both backend and frontend
```
Backend on port 8080, frontend on port 80.

## Architecture

### Backend — ASP.NET Core 9 (`ShopApi/`)
- **`Program.cs`** — Wires up EF Core (SQLite), JWT Bearer auth, CORS (allows `localhost:5173`), and OpenAPI.
- **`Data/ShopDb.cs`** — EF Core `DbContext` with `Products`, `Users`, `Orders`, `OrderItems` DbSets.
- **`Models/`** — `Product`, `User`, `Order`, `OrderItem`. `Order` has a `List<OrderItem>`, each item references a `Product`.
- **`Controllers/`** — `AuthController` (register/login, issues JWTs), `ProductsController` (CRUD; GET endpoints are public, write endpoints require `[Authorize]`).
- **`Migrations/`** — EF Core migration history.
- JWT config lives in `appsettings.json` under `"Jwt"` (Key, Issuer, Audience). **The key in appsettings is a dev secret — do not commit real secrets.**

### Frontend — React + TypeScript (`shop-frontend/src/`)
- **`api/axios.ts`** — Axios instance with `baseURL = http://localhost:5015/api/v1`. A request interceptor automatically attaches the JWT from `localStorage` as `Authorization: Bearer`.
- **`context/AuthContext.tsx`** — Auth state (token stored in `localStorage`). Exposes `login`, `register`, `logout`, `isAuthenticated`. Wrap components with `useAuth()` to access.
- **`pages/`** — One file per route: `LoginPage`, `RegisterPage`, `ProductsPage`, `ProductDetailPage`, `CartPage`, `OrdersPage`.
- **`components/Navbar.tsx`** — Single shared navigation component.
- **`types/`** — Shared TypeScript types (e.g., `AuthRequest`).
- Routing is handled by React Router in `App.tsx`; `/` redirects to `/products`.

### Key cross-cutting concerns
- Auth flow: frontend POSTs to `/api/v1/auth/login` → receives `{ token }` → stores in `localStorage` → all subsequent API calls send it via the Axios interceptor → backend validates via JWT Bearer middleware.
- CORS: backend allows only `http://localhost:5173` (Vite dev server). Update `Program.cs` if the frontend origin changes.
- EF Core uses SQLite (`shop.db` in the `ShopApi/` directory). In Docker, this file is bind-mounted from the host.
