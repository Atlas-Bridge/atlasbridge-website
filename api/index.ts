import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const { default: app, initializeApp } = await import("../server/app");
    await initializeApp();
    app(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack?.split("\n").slice(0, 10) : [];
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: message, stack }));
  }
}
