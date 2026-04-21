"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Password incorrecto");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-neutral-900">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold">Admin Login</h1>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full rounded-xl border border-neutral-300 px-4 py-2"
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-xl bg-green-700 px-4 py-2 font-semibold text-white"
        >
          Entrar
        </button>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}