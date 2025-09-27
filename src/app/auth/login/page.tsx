"use client";

import { type LoginFormData, loginSchema } from "../../../lib/validation/loginschema";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sendPasswordResetAction, signInAction } from "../../../lib/actions/useauth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
import { BsGoogle } from "react-icons/bs";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    const result = await signInAction(data);
    if (!result.success) {
      setError(result.error || "Falha no login.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setSuccess(null);
    const email = getValues("email");

    if (!email) {
      setError("Por favor, digite seu e-mail primeiro para recuperar a senha.");
      return;
    }

    const result = await sendPasswordResetAction(email);
    if (result.success) {
      setSuccess(result.message ?? null);
    } else {
      setError(result.error ?? null);
    }
  };

  return (
    <div className="min-h-screen flex items-center font-serif justify-center bg-emerald-300 p-6">
      <div className="w-full max-w-md bg-white/70 shadow-xl rounded-2xl text-emerald-800 p-8">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {error && <p className="text-sm text-red-600 text-center mb-2">{error}</p>}
        {success && <p className="text-sm text-green-600 text-center mb-2">{success}</p>}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    className="block w-full rounded-md border-gray-300 pl-10 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Senha
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="block w-full rounded-md border-gray-300 pl-10 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-slate-700">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="font-medium text-emerald-600 hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm text-emerald-800 mb-2">Ou entre com</div>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="cursor-pointer border bg-black/10 hover:shadow-lg p-2 rounded w-32 flex items-center justify-center gap-1"
            >
              <BsGoogle />
              Google
            </button>
            <button
              type="button"
              className="cursor-pointer border bg-black/10 hover:shadow-lg p-2 rounded w-32 flex items-center justify-center gap-1"
            >
              <Github/>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}