import type { IncomingMessage, ServerResponse } from "http";
import app, { initializeApp } from "../server/app";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await initializeApp();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack?.split("\n").slice(0, 5) : [];
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: message, stack }));
    return;
  }
  app(req, res);
}
