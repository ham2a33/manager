import type { ClientRecord } from "@/lib/api/types";

/**
 * TODO(backend): backend/app/database/models/domain.py defines a `Client`
 * table (id, company_id, external_user_id, channel, phone, email,
 * full_name, timestamps) but there is NO router for it under
 * backend/app/api/v1/*  (no `clients.py`, nothing registered in router.py).
 *
 * Per the task constraints we must not invent an endpoint. Once the backend
 * exposes something like `GET /clients`, replace the body below with a real
 * `apiClient.get<ClientRecord[]>("/clients")` call - the ClientRecord type
 * is already modeled 1:1 against the SQLAlchemy columns so no other change
 * should be needed on this side.
 *
 * Until then, the Customers page derives a *read-only* customer list from
 * GET /conversations (grouping by customer_external_id + channel), which is
 * the closest thing the current API exposes about "who is talking to us".
 */
export async function listCustomers(): Promise<ClientRecord[]> {
  throw new Error(
    "NOT_IMPLEMENTED: backend has no GET /clients endpoint yet. The Customers page falls back to deriving customers from /conversations."
  );
}
