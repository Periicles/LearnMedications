import { z as schema } from "zod";
import { AVATAR_CHOICES } from "@/features/profile/constants";
import { usernameSchema } from "./auth";

export const profileSchema = schema.object({
  username: usernameSchema,
  avatar: schema.enum(AVATAR_CHOICES, "Avatar inconnu."),
});

export const deleteAccountSchema = schema.object({
  confirmation: schema.string().trim().toLowerCase(),
});
