import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, policies, policyRuns, auditLogs,
  type User, type InsertUser,
  type Policy, type InsertPolicy,
  type PolicyRun, type InsertPolicyRun,
  type AuditLog, type InsertAuditLog,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getPolicies(): Promise<Policy[]>;
  getPolicy(id: string): Promise<Policy | undefined>;
  createPolicy(policy: InsertPolicy, userId: string): Promise<Policy>;
  updatePolicy(id: string, policy: Partial<InsertPolicy>): Promise<Policy | undefined>;
  deletePolicy(id: string): Promise<boolean>;

  getPolicyRuns(limit?: number): Promise<PolicyRun[]>;
  createPolicyRun(run: InsertPolicyRun): Promise<PolicyRun>;

  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  getDashboardStats(): Promise<{
    totalPolicies: number;
    activePolicies: number;
    totalRuns: number;
    allowedRuns: number;
    deniedRuns: number;
    escalatedRuns: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPolicies(): Promise<Policy[]> {
    return db.select().from(policies).orderBy(desc(policies.createdAt));
  }

  async getPolicy(id: string): Promise<Policy | undefined> {
    const [policy] = await db.select().from(policies).where(eq(policies.id, id));
    return policy;
  }

  async createPolicy(policy: InsertPolicy, userId: string): Promise<Policy> {
    const [created] = await db.insert(policies).values({ ...policy, createdBy: userId }).returning();
    return created;
  }

  async updatePolicy(id: string, policy: Partial<InsertPolicy>): Promise<Policy | undefined> {
    const [updated] = await db.update(policies).set(policy).where(eq(policies.id, id)).returning();
    return updated;
  }

  async deletePolicy(id: string): Promise<boolean> {
    const result = await db.delete(policies).where(eq(policies.id, id)).returning();
    return result.length > 0;
  }

  async getPolicyRuns(limit = 50): Promise<PolicyRun[]> {
    return db.select().from(policyRuns).orderBy(desc(policyRuns.createdAt)).limit(limit);
  }

  async createPolicyRun(run: InsertPolicyRun): Promise<PolicyRun> {
    const [created] = await db.insert(policyRuns).values(run).returning();
    return created;
  }

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }

  async getDashboardStats() {
    const allPolicies = await db.select().from(policies);
    const allRuns = await db.select().from(policyRuns);

    return {
      totalPolicies: allPolicies.length,
      activePolicies: allPolicies.filter(p => p.enabled).length,
      totalRuns: allRuns.length,
      allowedRuns: allRuns.filter(r => r.decision === "allow").length,
      deniedRuns: allRuns.filter(r => r.decision === "deny").length,
      escalatedRuns: allRuns.filter(r => r.decision === "escalate").length,
    };
  }
}

export const storage = new DatabaseStorage();
