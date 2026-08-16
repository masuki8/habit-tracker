"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Header from "@/components/header";
import { useSession } from "@/hooks/use-session";
import { clearSession } from "@/lib/auth-session";
import SideNav from "./_components/sidenav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const isAuthenticated = useSession();

  useEffect(() => {
    if (isAuthenticated === false) {
      clearSession();
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status">
        <span className="text-sm text-gray-500">認証情報を確認しています...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header showLogout />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNav />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-20 py-3">
          <h1 className="mt-7 w-full">Hello</h1>
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
