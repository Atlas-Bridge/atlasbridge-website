import type { IncomingMessage, ServerResponse } from "http";
import app, { initializeApp } from "../server/app";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await initializeApp();
    app(req, res);
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "initializeApp failed", details: err.message, stack: err.stack }));
  }
}
