import { describe, it, expect } from "vitest";
import {
  insertUserSchema,
  insertPolicySchema,
  insertAuditLogSchema,
} from "@shared/schema";

describe("insertUserSchema", () => {
  it("accepts valid user input", () => {
    const result = insertUserSchema.safeParse({
      username: "testuser",
      password: "securepassword123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing username", () => {
    const result = insertUserSchema.safeParse({
      password: "securepassword123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = insertUserSchema.safeParse({
      username: "testuser",
    });
    expect(result.success).toBe(false);
  });
});

describe("insertPolicySchema", () => {
  it("accepts valid policy with name only", () => {
    const result = insertPolicySchema.safeParse({
      name: "Test Policy",
    });
    expect(result.success).toBe(true);
  });

  it("accepts policy with all fields", () => {
    const result = insertPolicySchema.safeParse({
      name: "Full Policy",
      description: "A test policy",
      rules: [{ action: "deny" }],
      enforcement: "strict",
      enabled: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects policy without name", () => {
    const result = insertPolicySchema.safeParse({
      description: "Missing name",
    });
    expect(result.success).toBe(false);
  });
});

describe("insertAuditLogSchema", () => {
  it("accepts valid audit log", () => {
    const result = insertAuditLogSchema.safeParse({
      action: "policy.created",
      actor: "admin",
    });
    expect(result.success).toBe(true);
  });

  it("accepts audit log with optional fields", () => {
    const result = insertAuditLogSchema.safeParse({
      action: "policy.deleted",
      actor: "admin",
      target: "policy-123",
      details: { reason: "cleanup" },
      level: "warn",
    });
    expect(result.success).toBe(true);
  });

  it("rejects audit log without action", () => {
    const result = insertAuditLogSchema.safeParse({
      actor: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("rejects audit log without actor", () => {
    const result = insertAuditLogSchema.safeParse({
      action: "policy.created",
    });
    expect(result.success).toBe(false);
  });
});
