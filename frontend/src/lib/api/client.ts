import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// Matches backend/app/core/config.py -> settings.api_prefix = "/api/v1"
// and docker-compose.yml -> backend exposed on port 8000.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attaches the bearer token issued by POST /auth/login on every request.
// The backend decodes it in app/api/v1/deps.py::current_context and derives
// tenant_id from the token payload, so no extra X-Tenant-Id header is needed
// once the user is logged in.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
