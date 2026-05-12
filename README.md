# NutriCoach — Angular Frontend

## Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 17: `npm install -g @angular/cli`

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (runs on http://localhost:4200)
ng serve
```

The app expects the Spring Boot backend at `http://localhost:8080`.
Update `src/environments/environment.ts` if your backend runs elsewhere.

---

## Project Structure

```
src/app/
├── app.component.ts       # Root component (just <router-outlet>)
├── app.config.ts          # Angular providers: router, HTTP, animations
├── app.routes.ts          # All routes (lazy-loaded)
│
├── auth/
│   ├── login/             # /login  — public
│   └── register/          # /register — public
│
├── core/
│   ├── services/
│   │   └── auth.service.ts        # JWT login/register/logout
│   └── guards/
│       └── auth.guard.ts          # Protects all shell routes
│
├── shared/
│   ├── models/
│   │   └── models.ts              # All TypeScript interfaces
│   ├── interceptors/
│   │   └── jwt.interceptor.ts     # Attaches Bearer token to every request
│   └── navbar/
│       └── shell.component.ts     # Sidebar layout + <router-outlet>
│
├── dashboard/             # /dashboard
├── meal-log/              # /meal-log
├── ai-coach/              # /ai-coach
├── progress/              # /progress
└── settings/              # /settings
```

---

## Build for production

```bash
ng build
# Output in dist/nutricoach-app/
```

---

## Page build order (incremental)

1. ✅ Structure / shell / auth
2. ⬜ Dashboard
3. ⬜ Meal Log
4. ⬜ AI Coach
5. ⬜ Progress
6. ⬜ Settings
