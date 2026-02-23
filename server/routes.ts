import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { pool } from "./db";
import { insertUserSchema, insertPolicySchema, insertPolicyRunSchema } from "@shared/schema";

const PgSession = connectPgSimple(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "atlasbridge-dev-secret-change-in-prod",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      },
    })
  );

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const existing = await storage.getUserByUsername(parsed.data.username);
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const hashed = await bcrypt.hash(parsed.data.password, 12);
      const user = await storage.createUser({ ...parsed.data, password: hashed });

      await storage.createAuditLog({
        action: "user.register",
        actor: user.username,
        target: user.id,
        level: "info",
      });

      (req.session as any).userId = user.id;
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const user = await storage.getUserByUsername(parsed.data.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(parsed.data.password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      await storage.createAuditLog({
        action: "user.login",
        actor: user.username,
        target: user.id,
        level: "info",
      });

      (req.session as any).userId = user.id;
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ id: user.id, username: user.username, role: user.role });
  });

  const requireAuth = async (req: any, res: any, next: any) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    req.user = user;
    next();
  };

  app.get("/api/dashboard/stats", requireAuth, async (_req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  app.get("/api/policies", requireAuth, async (_req, res) => {
    const policies = await storage.getPolicies();
    res.json(policies);
  });

  app.post("/api/policies", requireAuth, async (req: any, res) => {
    try {
      const parsed = insertPolicySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid policy data" });
      }
      const policy = await storage.createPolicy(parsed.data, req.user.id);
      await storage.createAuditLog({
        action: "policy.create",
        actor: req.user.username,
        target: policy.id,
        details: { name: policy.name },
        level: "info",
      });
      res.json(policy);
    } catch (error) {
      console.error("Create policy error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/policies/:id", requireAuth, async (req: any, res) => {
    try {
      const policy = await storage.updatePolicy(req.params.id, req.body);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      await storage.createAuditLog({
        action: "policy.update",
        actor: req.user.username,
        target: policy.id,
        details: { name: policy.name },
        level: "info",
      });
      res.json(policy);
    } catch (error) {
      console.error("Update policy error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/policies/:id", requireAuth, async (req: any, res) => {
    try {
      const deleted = await storage.deletePolicy(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Policy not found" });
      }
      await storage.createAuditLog({
        action: "policy.delete",
        actor: req.user.username,
        target: req.params.id,
        level: "warn",
      });
      res.json({ message: "Policy deleted" });
    } catch (error) {
      console.error("Delete policy error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/runs", requireAuth, async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const runs = await storage.getPolicyRuns(limit);
    res.json(runs);
  });

  app.post("/api/runs", requireAuth, async (req: any, res) => {
    try {
      const parsed = insertPolicyRunSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid run data" });
      }
      const run = await storage.createPolicyRun(parsed.data);
      await storage.createAuditLog({
        action: `policy.run.${run.decision}`,
        actor: run.agent,
        target: run.policyId || undefined,
        details: { command: run.command, decision: run.decision },
        level: run.decision === "deny" ? "warn" : "info",
      });
      res.json(run);
    } catch (error) {
      console.error("Create run error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/audit-logs", requireAuth, async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const logs = await storage.getAuditLogs(limit);
    res.json(logs);
  });

  app.get("/api/docs", (_req, res) => {
    const docsDir = path.resolve(process.cwd(), "docs");
    try {
      const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".md")).sort();
      const docs = files.map(f => ({
        slug: f.replace(".md", ""),
        title: f.replace(".md", "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      }));
      res.json(docs);
    } catch {
      res.json([]);
    }
  });

  app.get("/api/docs/:slug", (req, res) => {
    const docsDir = path.resolve(process.cwd(), "docs");
    const slug = req.params.slug.replace(/[^a-z0-9-]/gi, "");
    const filePath = path.join(docsDir, `${slug}.md`);
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Document not found" });
      }
      const content = fs.readFileSync(filePath, "utf-8");
      res.json({ slug, content });
    } catch {
      res.status(500).json({ message: "Failed to read document" });
    }
  });

  return httpServer;
}
