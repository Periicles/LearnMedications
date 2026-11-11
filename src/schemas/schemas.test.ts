import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  usernameSchema,
} from "./auth";
import { deleteAccountSchema, profileSchema } from "./profile";
import { sessionInputSchema } from "./progress";
import { friendIdSchema, friendRequestSchema } from "./social";

describe("auth schemas", () => {
  it("normalises usernames and rejects invalid ones", () => {
    expect(usernameSchema.parse("  Lea_91 ")).toBe("lea_91");
    for (const invalid of ["ab", "a".repeat(21), "lea-91", "léa"]) {
      expect(usernameSchema.safeParse(invalid).success).toBe(false);
    }
  });

  it("lower-cases e-mails and bounds passwords", () => {
    expect(forgotPasswordSchema.parse({ email: "Lea@Example.COM" }).email).toBe("lea@example.com");
    const base = { username: "lea", email: "lea@example.com" };
    expect(signupSchema.safeParse({ ...base, password: "1234567" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, password: "x".repeat(73) }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, password: "x".repeat(72) }).success).toBe(true);
  });

  it("only requires a non-empty password at login", () => {
    expect(loginSchema.safeParse({ email: "a@b.fr", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "a@b.fr", password: "" }).success).toBe(false);
  });

  it("reports a confirmation mismatch on the confirmation field", () => {
    const result = resetPasswordSchema.safeParse({ password: "password-1", confirmation: "other" });
    expect(result.error?.issues[0].path).toEqual(["confirmation"]);
    expect(
      resetPasswordSchema.safeParse({ password: "password-1", confirmation: "password-1" }).success,
    ).toBe(true);
  });
});

describe("profile and social schemas", () => {
  it("accepts only known avatars", () => {
    expect(profileSchema.safeParse({ username: "lea", avatar: "💊" }).success).toBe(true);
    const unknown = profileSchema.safeParse({ username: "lea", avatar: "x" });
    expect(unknown.error?.issues[0].message).toBe("Avatar inconnu.");
  });

  it("normalises the account deletion confirmation", () => {
    expect(deleteAccountSchema.parse({ confirmation: "  LEA " }).confirmation).toBe("lea");
  });

  it("validates friend requests and ids", () => {
    expect(friendRequestSchema.parse({ username: "Bob" }).username).toBe("bob");
    expect(friendIdSchema.safeParse({ friendId: "nope" }).success).toBe(false);
    const uuid = "123e4567-e89b-42d3-a456-426614174000";
    expect(friendIdSchema.safeParse({ friendId: uuid }).success).toBe(true);
  });
});

describe("session input schema", () => {
  const record = { substanceSlug: "paracetamol", correct: true };

  it("accepts a valid session", () => {
    const input = { mode: "learn", collectionSlug: "pain", lessonKey: "l-1", records: [record] };
    expect(sessionInputSchema.safeParse(input).success).toBe(true);
  });

  it("rejects empty record lists, unknown modes and bad slugs", () => {
    expect(sessionInputSchema.safeParse({ mode: "learn", records: [] }).success).toBe(false);
    expect(sessionInputSchema.safeParse({ mode: "x", records: [record] }).success).toBe(false);
    const badSlug = { mode: "review", records: [{ ...record, substanceSlug: "Bad Slug" }] };
    expect(sessionInputSchema.safeParse(badSlug).success).toBe(false);
  });
});
