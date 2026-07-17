import { describe, expect, it } from "vitest";
import { isSafeReturnPath, loginSchema, signupSchema } from "@/lib/validation";

describe("auth validation", () => {
  it("requires email and password for login", () => {
    expect(loginSchema.safeParse({ email: "", password: "" }).success).toBe(false);
    expect(
      loginSchema.safeParse({ email: "guest@totea.test", password: "secret" }).success
    ).toBe(true);
  });

  it("rejects mismatched signup passwords", () => {
    const result = signupSchema.safeParse({
      fullName: "Test User",
      email: "test@gmail.com",
      password: "password123",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
  });

  it("preserves checkout return paths after login", () => {
    expect(isSafeReturnPath("/checkout")).toBe(true);
    expect(isSafeReturnPath("/account/orders")).toBe(true);
  });
});
