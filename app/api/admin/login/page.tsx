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
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Password incorrecto");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
      <div className="bg-neutral-800 p-6 rounded-xl w-80">
        <h1 className="text-xl mb-4">Admin Login</h1>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 text-black rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 p-2 rounded"
        >
          Entrar
        </button>

        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}