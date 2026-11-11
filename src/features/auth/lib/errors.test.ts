import { describe, expect, it } from "vitest";
import { describeAuthError } from "./errors";

describe("describeAuthError", () => {
  it("translates known codes", () => {
    expect(describeAuthError("weak_password")).toBe("Ce mot de passe est trop faible.");
    expect(describeAuthError("email_exists")).toBe(describeAuthError("user_already_exists"));
  });

  it("falls back for unknown or missing codes", () => {
    const fallback = "Une erreur est survenue. Réessayez dans un instant.";
    expect(describeAuthError("whatever")).toBe(fallback);
    expect(describeAuthError(undefined)).toBe(fallback);
  });
});
