"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "@/components/header";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useSession } from "@/hooks/use-session";
import { apiFetch } from "@/lib/api";
import { clearSession, requireAccessToken } from "@/lib/auth-session";
import type { HabitResponse } from "@/types/api";
import SideNav from "./_components/sidenav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSession();
  const [navigationHabits, setNavigationHabits] = useState<HabitResponse[]>([]);

  useEffect(() => {
    if (isAuthenticated === false) {
      clearSession();
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const controller = new AbortController();
    const token = requireAccessToken();

    apiFetch<HabitResponse[]>("/me/habits", {
      token,
      signal: controller.signal,
    })
      .then(setNavigationHabits)
      .catch(() => {
        if (!controller.signal.aborted) setNavigationHabits([]);
      });

    return () => controller.abort();
  }, [isAuthenticated, pathname]);

  if (!isAuthenticated) {
    return <LoadingScreen message="認証情報を確認しています..." />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header showLogout habits={navigationHabits} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNav habits={navigationHabits} />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-7 sm:px-6 lg:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
