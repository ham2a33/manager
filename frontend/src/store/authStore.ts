import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  companyId: string | null;
  role: string | null;
  email: string | null;
  isAuthenticated: boolean;
  setSession: (payload: { token: string; companyId: string; role: string; email: string }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      companyId: null,
      role: null,
      email: null,
      isAuthenticated: false,
      setSession: ({ token, companyId, role, email }) =>
        set({ token, companyId, role, email, isAuthenticated: true }),
      clearSession: () =>
        set({ token: null, companyId: null, role: null, email: null, isAuthenticated: false }),
    }),
    {
      // NOTE: this is a demo-grade JWT (see backend/app/core/security.py, it is
      // a signed pipe-delimited string, not a real JWT). Storing it in
      // localStorage (via zustand persist) mirrors how the backend expects it
      // back on every request: `Authorization: Bearer <token>`.
      name: "ai-manager-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        companyId: state.companyId,
        role: state.role,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
