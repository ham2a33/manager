# AI Manager — Frontend

Production-ready Next.js 15 / React 19 / TypeScript frontend for the existing
FastAPI backend in `backend/`. Built to use the backend **exactly as it is
today** — no invented endpoints, no changes to `backend/`.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- TailwindCSS + hand-written shadcn/ui-style primitives (`src/components/ui`)
- TanStack React Query for server state
- Zustand for auth/session state (persisted to `localStorage`)
- Axios API client with a bearer-token interceptor
- React Hook Form + Zod for forms/validation
- Recharts for the Statistics page

## Getting started

```bash
cd frontend
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev
```

The backend must be running (see root `docker-compose.yml` / `make dev`) and
reachable at the URL in `NEXT_PUBLIC_API_URL` (default
`http://localhost:8000/api/v1`, matching `backend/app/core/config.py`).

Demo login seeded by `backend/app/database/database.py::seed_demo_data`:

```
email:    owner@example.com
password: password
```

## Project structure

```
src/
  app/
    login/                     Public login page
    (dashboard)/                Auth-guarded shell (sidebar + topbar)
      dashboard/                 Overview: totals + recent conversations
      conversations/             CRM inbox (list + chat pane)
        [id]/
      customers/                 Customers table
      knowledge/                 Knowledge base (list/upload/view)
      statistics/                Charts + metrics
      settings/                  Company + Channels tabs
  components/
    ui/                         Hand-written shadcn-style primitives
    layout/                     Sidebar, Topbar, AuthGuard
    conversations/ dashboard/ customers/ knowledge/ statistics/ settings/
    shared/                     ChannelBadge/StatusBadge, TodoBackendNotice
  hooks/                        React Query hooks per domain
  lib/api/                      One file per backend router, 1:1 typed
  store/                        Zustand auth store
```

## API coverage — what's real vs. what's a TODO

Every file in `src/lib/api/*.ts` is commented with the exact backend route it
calls. The mapping was built by reading `backend/app/api/v1/*.py`,
`backend/app/api/v1/schemas.py` and `backend/app/database/models/domain.py`
directly, **not** from `docs/`, since the code is the source of truth.

Implemented and wired end-to-end:

| Endpoint | Used by |
| --- | --- |
| `POST /auth/login` | `/login` |
| `GET /companies/{id}` | Topbar, Settings |
| `GET/POST /conversations`, `GET /conversations/{id}`, `GET /conversations/{id}/messages`, `POST /conversations/{id}/summary` | `/conversations`, `/conversations/[id]`, Dashboard |
| `POST /messages/{conversation_id}` | Chat window (send + "reply with AI") |
| `GET /knowledge`, `POST /knowledge`, `POST /knowledge/search` | `/knowledge` |
| `GET /statistics/overview` | Dashboard, `/statistics` |
| `GET /subscriptions/current` | `/statistics` |
| `GET /ai/providers`, `POST /ai/complete` | wired in `lib/api/ai.ts`, available for future use |

**Explicitly marked as backend TODOs (not invented, not faked):**

- **Customers list** — `Client` exists as a DB model
  (`app/database/models/domain.py`) but has no router. `src/lib/api/customers.ts`
  documents this; the `/customers` page instead derives a read-only list from
  `GET /conversations` via `src/hooks/useCustomers.ts`. Swap that hook for a
  real query once `GET /clients` ships.
- **Company settings update** — no `PATCH /companies/{id}`, and the `Company`
  model has no email/phone/language/prompt columns. The Settings → Company
  form shows the real (read-only) name and disables the rest, with an inline
  notice and a pointer to `src/lib/api/companies.ts`.
- **Channel configuration (Telegram/WhatsApp/Instagram)** — `ChannelRecord`
  exists in the DB but has no router. Settings → Channels renders the target
  UI, disabled, documented in `src/lib/api/channels.ts`.
- **Knowledge document delete / file upload** — no `DELETE /knowledge/{id}`
  and no multipart upload route (`KnowledgeCreate` only accepts
  `{title, content}` text). The Knowledge page reads the chosen file's text
  client-side and posts it as `content`; the delete button is disabled with a
  tooltip.

Search `TODO(backend)` across `src/` to find every one of these in place.

## Auth model

`backend/app/core/security.py` issues a signed, pipe-delimited token (not a
real JWT) via `create_access_token`. The frontend treats it as an opaque
bearer token: it's stored in Zustand/`localStorage` and attached as
`Authorization: Bearer <token>` on every request
(`src/lib/api/client.ts`). The backend derives `tenant_id` from that token in
`app/api/v1/deps.py`, so no extra `X-Tenant-Id` header is required once
logged in.
