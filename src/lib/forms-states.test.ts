import { describe, expect, it } from "vitest";
import { z as schema } from "zod";
import { fieldError, formSuccess, IDLE_FORM_STATE, validationError } from "./forms";

describe("form state helpers", () => {
  it("builds idle and success states", () => {
    expect(IDLE_FORM_STATE).toEqual({ status: "idle" });
    expect(formSuccess("Done")).toEqual({ status: "success", message: "Done" });
  });

  it("echoes values with a field error", () => {
    expect(fieldError("email", "Bad", { email: "x" })).toEqual({
      status: "error",
      fieldErrors: { email: "Bad" },
      values: { email: "x" },
    });
  });

  it("files root-level issues under the form key and keeps the first message", () => {
    const parsed = schema.string().min(5, "Too short").regex(/^a/, "Start with a").safeParse("b");
    const state = parsed.success ? null : validationError(parsed.error);
    expect(state?.fieldErrors).toEqual({ form: "Too short" });
    expect(state?.values).toBeUndefined();
  });
});
