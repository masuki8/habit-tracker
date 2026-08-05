"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { apiFetch } from "@/lib/api";

type UserResponse = {
  id: number;
  name: string;
  email: string;
};

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("名前は2文字以上で入力してください。");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください。");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("パスワードが一致していません。");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch<UserResponse>("/users", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      router.push("/login?registered=true");
    } catch (requestError) {
      setError(
        requestError instanceof Error && requestError.message
          ? requestError.message
          : "アカウントを作成できませんでした。もう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-xl">サインイン</h2>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            ユーザー名
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#42585E] focus:ring-2 focus:ring-[#8ebcc8]"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="ユーザー名"
            minLength={2}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            パスワード
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#42585E] focus:ring-2 focus:ring-[#8ebcc8]"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="6文字以上"
            minLength={6}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-gray-700"
            htmlFor="password-confirmation"
          >
            パスワード（確認）
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#42585E] focus:ring-2 focus:ring-[#8ebcc8]"
            id="password-confirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            placeholder="もう一度入力してください"
            minLength={6}
            required
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
        </div>

        {error && (
          <p
            className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <button
          className="w-full rounded-md bg-[#42585E] px-4 py-3 mt-4 text-[#eaedef] transition focus:outline-none focus:ring-2 focus:ring-[#42585E] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "作成中..." : "アカウントを作成"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        すでにアカウントをお持ちですか？ <Link href="/login" className="text-[#42585E] font-semibold">ログイン</Link>
      </p>
    </div>
  );
}
