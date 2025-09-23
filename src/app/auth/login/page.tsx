"use client";

import React, { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setEmailError(validateEmail(email) || !email.length ? null : "E-mail inválido");
  }, [email]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!validateEmail(email)) return setEmailError("E-mail inválido");
    if (!password.length) return setPasswordError("Senha obrigatória");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage("(Simulação) Login enviado ao servidor");
    }, 800);
  }

  return (
    <div className="min-h-screen flex items-center font-serif justify-center bg-emerald-300 p-6">
      <div className="w-full max-w-md bg-black/20 shadow-xl rounded-2xl text-emerald-800 p-8">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {message && <div className="mb-3 text-sm text-center text-slate-700">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-lg">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              placeholder="seu@exemplo.com"
            />
            {emailError && <div className="text-xs text-red-500">{emailError}</div>}
          </div>

          <div>
            <label className="text-lg">Senha</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Sua senha"
            />
            {passwordError && <div className="text-sm text-red-500">{passwordError}</div>}
          </div>

          <div className="flex gap-2 pt-4 items-center justify-between">
            <button disabled={loading} className="cursor-pointer px-10 py-2 rounded bg-emerald-800 text-white">
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button type="button" className="cursor-pointer text-sm underline">
              Esqueci minha senha
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <div className="text-sm text-emerald-800 mb-2">Ou entre com</div>
          <div className="flex gap-2 justify-center">
            <button type="button" className="cursor-pointer border bg-black/10 p-2 rounded w-24">Google</button>
            <button type="button" className="cursor-pointer border bg-black/10 p-2 rounded w-24">GitHub</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
