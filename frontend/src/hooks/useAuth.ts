"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login as loginRequest } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest } from "@/lib/api/types";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginRequest) => loginRequest(payload),
    onSuccess: (data, variables) => {
      setSession({
        token: data.access_token,
        companyId: data.company_id,
        role: data.role,
        email: variables.email,
      });
      router.replace("/dashboard");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  return () => {
    clearSession();
    router.replace("/login");
  };
}
