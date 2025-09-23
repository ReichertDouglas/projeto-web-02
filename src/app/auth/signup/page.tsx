"use client";

import React, { useState, useEffect } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setNameError(name.length >= 2 || !name.length ? null : "Nome muito curto");
  }, [name]);

  useEffect(() => {
    setCpfError(cpf.length ? (validateCPF(cpf) ? null : "CPF inválido") : null);
  }, [cpf]);

  useEffect(() => {
    setEmailError(
      validateEmail(email) || !email.length ? null : "E-mail inválido"
    );
  }, [email]);

  useEffect(() => {
    const { score, error } = validatePassword(password);
    setPasswordStrength(score);
    setPasswordError(error);
  }, [password]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!validateEmail(email)) return setEmailError("E-mail inválido");
    const pw = validatePassword(password);
    if (pw.error) return setPasswordError(pw.error);
    if (!name.trim()) return setNameError("Nome obrigatório");
    if (!validateCPF(cpf)) return setCpfError("CPF inválido");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage("(Simulação) Cadastro enviado ao servidor");
    }, 800);
  }

  return (
    <div className="min-h-screen flex items-center font-serif justify-center bg-emerald-300 p-6">
      <div className="w-full max-w-md bg-black/20 text-emerald-800 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Cadastro
        </h2>

        {message && (
          <div className="mb-3 text-sm text-center text-emerald-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-lg">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Seu nome completo"
            />
            {nameError && (
              <div className="text-xs text-red-500">{nameError}</div>
            )}
          </div>

          <div>
            <label className="text-lg">CPF</label>
            <input
              value={cpf}
              onChange={(e) => setCpf(maskCPF(e.target.value))}
              maxLength={14}
              className="w-full mt-1 p-2 border rounded"
              placeholder="000.000.000-00"
            />
            {cpfError && <div className="text-xs text-red-500">{cpfError}</div>}
          </div>

          <div>
            <label className="text-lg">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              placeholder="seu@exemplo.com"
            />
            {emailError && (
              <div className="text-xs text-red-500">{emailError}</div>
            )}
          </div>

          <div>
            <label className="text-lg">Senha</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Mínimo 8 caracteres"
            />
            {password.length > 0 && (
              <PasswordStrengthBar score={passwordStrength} />
            )}
            {passwordError && (
              <div className="text-sm text-red-500">{passwordError}</div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              disabled={loading}
              className="cursor-pointer px-4 py-2 rounded bg-emerald-800 text-white"
            >
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordStrengthBar({ score }: { score: number }) {
  const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Muito forte"];
  return (
    <div className="mt-2">
      <div className="h-2 bg-white/50 rounded overflow-hidden">
        <div
          style={{ width: `${(score / 4) * 100}%` }}
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
        ></div>
      </div>
      <div className="text-sm mt-1 text-emerald-800">
        {labels[Math.max(0, Math.min(4, score))]}
      </div>
    </div>
  );
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pw: string) {
  if (pw.length == 0) return { score: 0, error: null };
  if (pw.length < 8)
    return { score: 0, error: "A senha deve ter ao menos 8 caracteres" };
  let score = 0;
  if (/[0-9]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const error = pw.length >= 8 ? null : "Senha muito curta";
  return { score: Math.min(4, score), error };
}

function maskCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  let out = digits;
  if (digits.length > 9)
    out = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
      6,
      9
    )}-${digits.slice(9)}`;
  else if (digits.length > 6)
    out = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  else if (digits.length > 3) out = `${digits.slice(0, 3)}.${digits.slice(3)}`;
  return out;
}

function validateCPF(raw: string) {
  const cpf = raw.replace(/\D/g, "");
  if (!cpf || cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let first = (sum * 10) % 11;
  if (first === 10) first = 0;
  if (first !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let second = (sum * 10) % 11;
  if (second === 10) second = 0;
  if (second !== parseInt(cpf[10])) return false;
  return true;
}
