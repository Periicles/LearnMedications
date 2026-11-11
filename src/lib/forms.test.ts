import { describe, expect, it } from "vitest";
import { loginSchema } from "@/schemas/auth";
import { fieldError, formError, pickValues, validationError } from "./forms";

function makeFormData(entries: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(entries).forEach(([field, value]) => formData.set(field, value));
  return formData;
}

describe("pickValues", () => {
  it("keeps only the requested text fields", () => {
    const formData = makeFormData({ email: "lea@example.com", password: "secret" });
    expect(pickValues(formData, ["email", "missing"])).toEqual({ email: "lea@example.com" });
  });
});

describe("form states", () => {
  const values = { email: "not-an-email" };

  it("echoes values with validation errors and keeps one message per field", () => {
    const parsed = loginSchema.safeParse({ email: "not-an-email", password: "" });
    const state = parsed.success ? null : validationError(parsed.error, values);
    expect(state).toMatchObject({ status: "error", values });
    expect(Object.keys(state?.fieldErrors ?? {})).toEqual(["email", "password"]);
  });

  it("builds general and field errors", () => {
    expect(formError("Oops", values)).toEqual({ status: "error", message: "Oops", values });
    expect(fieldError("username", "Taken")).toMatchObject({ fieldErrors: { username: "Taken" } });
  });
});
