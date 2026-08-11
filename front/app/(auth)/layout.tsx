"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/header";
import { useSession } from "@/hooks/use-session";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const isAuthenticated = useSession();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated !== false) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status">
        <span className="text-sm text-gray-500">認証情報を確認しています...</span>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col gap-15 my-15 items-center">
        <h1>Habit Tracker</h1>
        {children}
      </main>
    </>
  );
}
