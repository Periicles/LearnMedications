import { z as schema } from "zod";

const email = schema.email("Adresse e-mail invalide.").trim().toLowerCase();
const password = schema
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(72, "Le mot de passe est trop long.");

export const usernameSchema = schema
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, "3 à 20 caractères : lettres, chiffres ou tiret bas.");

export const loginSchema = schema.object({
  email,
  password: schema.string().min(1, "Mot de passe requis."),
});

export const signupSchema = schema.object({ username: usernameSchema, email, password });

export const forgotPasswordSchema = schema.object({ email });

export const resetPasswordSchema = schema
  .object({ password, confirmation: schema.string() })
  .refine((values) => values.password === values.confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmation"],
  });
