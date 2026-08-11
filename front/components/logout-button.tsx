"use client";

import { useRouter } from "next/navigation";

import { clearSession } from "@/lib/auth-session";
import { Button } from "./ui/button";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <Button type="button" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
