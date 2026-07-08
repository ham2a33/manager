import { apiClient } from "@/lib/api/client";
import type { LoginRequest, LoginResponse } from "@/lib/api/types";

// Maps to backend/app/api/v1/auth.py -> POST /auth/login
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}
