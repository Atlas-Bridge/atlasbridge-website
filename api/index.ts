import type { IncomingMessage, ServerResponse } from "http";

let app: any;
let initializeApp: any;
let loadError: string | null = null;

try {
  const mod = await import("../server/app.js");
  app = mod.default || mod;
  initializeApp = mod.initializeApp;
} catch (e: unknown) {
  const err = e instanceof Error ? e : new Error(String(e));
  loadError = `${err.message}\n${err.stack}`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (loadError) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Module load failed", details: loadError }));
    return;
  }

  try {
    await initializeApp();
    app(req, res);
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Handler error", details: err.message, stack: err.stack }));
  }
}
