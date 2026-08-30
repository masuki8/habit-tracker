"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { ErrorScreen } from "@/components/ui/error-screen";
import { FormCard } from "@/components/ui/form-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";

type UserResponse = {
  id: number;
  accountId: string;
  name: string;
  email: string;
};

export default function SettingsPage() {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMe() {
      try {
        const accessToken = requireAccessToken();
        const user = await apiFetch<UserResponse>("/me", {
          token: accessToken,
          signal: controller.signal,
        });
        setToken(accessToken);
        setName(user.name);
        setEmail(user.email);
        setAccountId(user.accountId ?? "");
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setLoadError(requestError instanceof Error ? requestError.message : "設定を取得できませんでした。");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchMe();
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("名前は2文字以上で入力してください。");
      return;
    }
    if (password && password.length < 6) {
      setError("パスワードは6文字以上で入力してください。");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("パスワードが一致していません。");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch<UserResponse>("/me", {
        method: "PUT",
        token,
        body: JSON.stringify({
          email: null,
          name: name.trim(),
          password: password || null,
        }),
      });
      setPassword("");
      setPasswordConfirmation("");
      saveFlashMessage({ message: "設定を更新しました。", variant: "success" });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "設定を更新できませんでした。");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingScreen message="設定を読み込んでいます..." />;
  if (loadError) return <ErrorScreen message={loadError} />;

  return (
    <FormCard className="mx-auto w-full max-w-2xl">
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <h2>ユーザー設定</h2>
        <div>
          <Label htmlFor="settings-name">ユーザー名</Label>
          <Input id="settings-name" minLength={2} required value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <p className="text-sm font-medium">アカウントID</p>
          <p className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-700">
            @{accountId}
          </p>
          <p className="mt-1 text-xs text-gray-500">アカウントIDは変更できません</p>
        </div>
        <div>
          <Label htmlFor="settings-email">メールアドレス</Label>
          <Input id="settings-email" type="email" value={email} disabled />
        </div>
        <div>
          <Label htmlFor="settings-password">新しいパスワード</Label>
          <Input id="settings-password" type="password" autoComplete="new-password" minLength={6} placeholder="変更する場合のみ入力" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="settings-password-confirmation">新しいパスワード（確認）</Label>
          <Input id="settings-password-confirmation" type="password" autoComplete="new-password" minLength={6} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} />
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button className="ml-auto block" type="submit" isLoading={isSubmitting} loadingLabel="更新中">
          設定を保存
        </Button>
      </form>
    </FormCard>
  );
}
