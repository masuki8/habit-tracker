"use client";

import Link from "next/link";
import { Home, Plus, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

import type { HabitResponse } from "@/types/api";

type NavigationLinksProps = {
  habits: HabitResponse[];
  onNavigate?: () => void;
};

export function NavigationLinks({ habits, onNavigate }: NavigationLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="メインメニュー">
      <ul className="space-y-1.5">
        <li>
          <NavigationLink
            href="/"
            isActive={pathname === "/"}
            icon={<Home className="size-5" strokeWidth={1.8} />}
            onNavigate={onNavigate}
          >
            ホーム
          </NavigationLink>
        </li>
        <li>
          <NavigationLink
            href="/settings"
            isActive={pathname.startsWith("/settings")}
            icon={<Settings className="size-5" strokeWidth={1.8} />}
            onNavigate={onNavigate}
          >
            設定
          </NavigationLink>
        </li>
      </ul>

      <div className="mt-8 flex items-center justify-between px-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-text/55">
          My Habits
        </p>
        <Link
          href="/habit/create"
          onClick={onNavigate}
          aria-label="Habitを追加"
          className="grid size-7 place-items-center rounded-lg text-primary-text/70 transition hover:bg-white/10 hover:text-white"
        >
          <Plus className="size-4" />
        </Link>
      </div>

      {habits.length === 0 ? (
        <p className="mt-3 px-3 text-xs leading-5 text-primary-text/50">
          登録中のHabitはありません
        </p>
      ) : (
        <ul className="mt-2 max-h-[45vh] space-y-1 overflow-y-auto pr-1">
          {habits.map((habit, index) => {
            const href = `/habit/${habit.id}`;
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            const accentClasses = ["bg-primary-light", "bg-secondary", "bg-accent-yellow"];

            return (
              <li key={habit.id}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-primary-text/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold text-white ${accentClasses[index % accentClasses.length]}`}
                  >
                    {habit.title.slice(0, 1)}
                  </span>
                  <span className="truncate">{habit.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}

function NavigationLink({
  href,
  isActive,
  icon,
  children,
  onNavigate,
}: {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
        isActive
          ? "bg-white/20 text-white shadow-sm"
          : "text-primary-text/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
