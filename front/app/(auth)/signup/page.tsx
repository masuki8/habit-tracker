"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { FormCard } from "@/components/ui/form-card";
import { ErrorMessage } from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, apiFetch } from "@/lib/api";
import { saveFlashMessage } from "@/lib/flash-message";
import { saveLoginEmail } from "@/lib/login-email";

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
    const trimmedEmail = email.trim();

    try {
      await apiFetch<UserResponse>("/users", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          password,
        }),
      });
      saveFlashMessage({
        message: "アカウントが作成されました。ログインしてください。",
        variant: "success",
      });
      saveLoginEmail(trimmedEmail);
      router.push("/login");
    } catch (requestError) {
      // Emailがすでに登録済の場合
      if (requestError instanceof ApiError && requestError.status === 409) {
        saveFlashMessage({
          message: "このメールアドレスは登録済みです。ログインしてください。",
          variant: "info",
        });
        saveLoginEmail(trimmedEmail);
        router.push("/login");
        return;
      }

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
    <div className="px-6">
      <FormCard className="w-lg max-w-lg">
        <div className="mb-8 text-center">
          <h2>サインイン</h2>
          <hr className="title-border" />
        </div>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <Label htmlFor="name">ユーザー名</Label>
            <Input
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
            <Label htmlFor="email">メールアドレス</Label>
            <Input
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
            <Label htmlFor="password">パスワード</Label>
            <Input
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
            <Label htmlFor="password-confirmation">パスワード（確認）</Label>
            <Input
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

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button
            className="mt-8 ml-auto block"
            type="submit"
            isLoading={isSubmitting}
            loadingLabel="アカウントを作成中"
          >
            アカウントを作成
          </Button>
        </form>
      </FormCard>
      <p className="my-6 text-center text-sm">
        すでにアカウントをお持ちですか？{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          ログイン
        </Link>
      </p>
    </div>
  );
}
