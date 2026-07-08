"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initialsFromText } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/conversations": "Диалоги",
  "/customers": "Клиенты",
  "/knowledge": "База знаний",
  "/statistics": "Статистика",
  "/settings": "Настройки",
};

function resolveTitle(pathname: string) {
  const match = Object.keys(PAGE_TITLES).find((key) => pathname.startsWith(key));
  return match ? PAGE_TITLES[match] : "AI Manager";
}

export function Topbar() {
  const pathname = usePathname();
  const email = useAuthStore((state) => state.email);
  const role = useAuthStore((state) => state.role);
  const logout = useLogout();
  const { data: company } = useCompany();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{resolveTitle(pathname)}</h1>
        {company?.name && <p className="text-xs text-muted-foreground">{company.name}</p>}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-accent">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{email ? initialsFromText(email) : <UserIcon className="h-4 w-4" />}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-none">{email ?? "Пользователь"}</p>
            <p className="text-xs text-muted-foreground">{role ?? "owner"}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
