"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import type { HabitResponse } from "@/types/api";
import { LogoutButton } from "./logout-button";
import { NavigationLinks } from "./navigation-links";

type HeaderProps = {
  showLogout?: boolean;
  habits?: HabitResponse[];
};

export default function Header({
  showLogout = false,
  habits = [],
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="relative z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-black/5 bg-surface px-4 sm:px-6">
        <Link href="/" className="brand-mark text-xl text-ink-brown">
          Habit Tracker
        </Link>

        {showLogout && (
          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <LogoutButton />
            </div>
            <button
              type="button"
              aria-label="メニューを開く"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen(true)}
              className="grid size-11 place-items-center rounded-xl text-primary transition hover:bg-primary/10 lg:hidden"
            >
              <Menu className="size-6" />
            </button>
          </div>
        )}
      </header>

      {showLogout && isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="メニューを閉じる"
            className="absolute inset-0 bg-ink-brown/45 backdrop-blur-[2px]"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside
            id="mobile-navigation"
            aria-label="モバイルメニュー"
            className="absolute right-0 top-0 flex h-full w-[min(86vw,340px)] flex-col bg-primary px-4 py-5 text-primary-text shadow-2xl"
          >
            <div className="flex items-center justify-between px-2 py-2">
              <div>
                <p className="brand-mark text-2xl text-primary-text">
                  Habit Tracker
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-primary-text/55">
                  Habit journal
                </p>
              </div>
              <button
                type="button"
                aria-label="メニューを閉じる"
                onClick={() => setIsMenuOpen(false)}
                className="grid size-10 place-items-center rounded-xl text-primary-text/80 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="mt-7 min-h-0 flex-1 overflow-y-auto">
              <NavigationLinks
                habits={habits}
                onNavigate={() => setIsMenuOpen(false)}
              />
            </div>

            <div className="border-t border-white/10 px-2 pt-4">
              <LogoutButton className="text-primary-text hover:bg-white/10 hover:text-white" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
