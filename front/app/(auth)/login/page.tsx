"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { FormCard } from "@/components/ui/form-card";
import { ErrorMessage } from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { saveSession } from "@/lib/auth-session";
import { clearLoginEmail, getLoginEmail } from "@/lib/login-email";

type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(getLoginEmail());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      saveSession(response.accessToken, response.expiresIn);
      router.replace("/");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "";
      setError(
        message.includes("401")
          ? "メールアドレスまたはパスワードが正しくありません。"
          : message || "ログインできませんでした。もう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
      clearLoginEmail();
    }
  }

  return (
    <div className="px-6">
      <FormCard className="w-lg max-w-lg">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h2>ログイン</h2>
            <hr className="title-border" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="パスワードを入力"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button
              className="mt-8 ml-auto block"
              type="submit"
              isLoading={isSubmitting}
              loadingLabel="ログイン中"
            >
              ログイン
            </Button>
          </form>
        </div>
      </FormCard>
      <p className="my-6 text-center text-sm text-gray-600">
        アカウントをお持ちでないですか？{" "}
        <Link
          className="text-primary font-semibold hover:underline"
          href="/signup"
        >
          サインイン
        </Link>
      </p>
    </div>
  );
}
