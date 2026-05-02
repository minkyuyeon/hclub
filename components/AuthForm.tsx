"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });
    const payload = await response.json();
    setLoading(false);

    if (!payload.ok) {
      setMessage(payload.error?.message || "Không đăng nhập được.");
      return;
    }

    router.push(searchParams.get("next") || (payload.data?.role === "admin" ? "/admin" : "/"));
    router.refresh();
  }

  return (
    <form className="admin-card mx-auto grid w-full max-w-md gap-4 p-6" onSubmit={submit}>
      <div>
      <img className="mx-auto mb-4 h-20 object-contain" src="/images/logo-h-club-official.png" alt="H Club" loading="eager" decoding="async" />
        <h1 className="text-center text-3xl font-black">{mode === "login" ? "Đăng nhập CMS" : "Đăng ký tài khoản"}</h1>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-300">Email</span>
        <input className="rounded-lg border border-white/10 bg-black/20 p-3" name="email" type="email" required />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-300">Mật khẩu</span>
        <input className="rounded-lg border border-white/10 bg-black/20 p-3" name="password" type="password" required minLength={8} />
      </label>
      <button className="rounded-lg bg-rose px-5 py-3 font-black text-black" disabled={loading} type="submit">
        {loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Đăng ký"}
      </button>
      {message ? <p className="text-sm font-bold text-red-300">{message}</p> : null}
      <a className="text-center text-sm text-slate-400 hover:text-white" href={mode === "login" ? "/register" : "/login"}>
        {mode === "login" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
      </a>
    </form>
  );
}
