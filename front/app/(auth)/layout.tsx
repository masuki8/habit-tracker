"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/header";
import { LoadingScreen } from "@/components/ui/loading-screen";
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
    return <LoadingScreen message="認証情報を確認しています..." />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="relative flex flex-1 flex-col items-center gap-8 overflow-hidden px-4 py-10 sm:gap-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 top-24 size-72 rounded-full bg-accent-yellow/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 size-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative text-center">
          <h1 className="brand-mark text-3xl text-ink-brown sm:text-4xl">
            Habit Tracker
          </h1>
          <p className="mt-3 text-xs font-medium tracking-[0.18em] text-primary/70">
            SMALL HABITS, LASTING CHANGE
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
