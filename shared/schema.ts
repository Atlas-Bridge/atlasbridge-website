import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("viewer"),
});

export const policies = pgTable("policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  rules: jsonb("rules").notNull().default(sql`'[]'::jsonb`),
  enforcement: text("enforcement").notNull().default("strict"),
  enabled: boolean("enabled").notNull().default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const policyRuns = pgTable("policy_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").references(() => policies.id),
  agent: text("agent").notNull(),
  command: text("command").notNull(),
  decision: text("decision").notNull(),
  reason: text("reason"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  target: text("target"),
  details: jsonb("details"),
  level: text("level").notNull().default("info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPolicySchema = createInsertSchema(policies).pick({
  name: true,
  description: true,
  rules: true,
  enforcement: true,
  enabled: true,
});

export const insertPolicyRunSchema = createInsertSchema(policyRuns).pick({
  policyId: true,
  agent: true,
  command: true,
  decision: true,
  reason: true,
  duration: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).pick({
  action: true,
  actor: true,
  target: true,
  details: true,
  level: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type Policy = typeof policies.$inferSelect;
export type InsertPolicyRun = z.infer<typeof insertPolicyRunSchema>;
export type PolicyRun = typeof policyRuns.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
