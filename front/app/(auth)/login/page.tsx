"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

import { apiFetch } from "@/lib/api";

type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export default function Login() {
  return (
    <Suspense fallback={<LoginForm hasRegistered={false} />}>
      <LoginWithSearchParams />
    </Suspense>
  );
}

function LoginWithSearchParams() {
  const searchParams = useSearchParams();
  return <LoginForm hasRegistered={searchParams.get("registered") === "true"} />;
}

function LoginForm({ hasRegistered }: { hasRegistered: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
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

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem(
        "accessTokenExpiresAt",
        String(Date.now() + response.expiresIn * 1000),
      );
      router.push("/");
      router.refresh();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "";
      setError(
        message.includes("401")
          ? "メールアドレスまたはパスワードが正しくありません。"
          : message || "ログインできませんでした。もう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h2 className="text-xl">ログイン</h2>
      </div>


      {hasRegistered && (
        <p
          className="mb-5 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-[#42585E]"
          role="status"
        >
          アカウントを作成しました。ログインしてください。
        </p>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="email">
            メールアドレス
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#42585E] focus:ring-2 focus:ring-[#8ebcc8]"
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
          <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="password">
            パスワード
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#42585E] focus:ring-2 focus:ring-[#8ebcc8]"
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

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          className="w-full rounded-lg bg-[#42585E] px-4 py-2.5 font-medium text-white transition hover:bg-[#42585E] focus:outline-none focus:ring-2 focus:ring-[#42585E] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        アカウントをお持ちでないですか？{" "}
        <Link className="text-[#42585E] font-semibold" href="/signup">
          サインイン
        </Link>
      </p>
    </div>
  );
}
