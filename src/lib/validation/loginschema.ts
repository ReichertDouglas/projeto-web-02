import { z } from "zod";

// Schema de cadastro
export const signupSchema = z
  .object({
    email: z.email("Por favor, insira um e-mail válido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

// Schema de login
export const loginSchema = z.object({
  email: z.email("Por favor, insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

// Schema de recuperação de senha
export const forgotPasswordSchema = z.object({
  email: z.email("Por favor, insira um e-mail válido para recuperar sua senha."),
});

// Tipagens inferidas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;