import type { IncomingMessage, ServerResponse } from "http";
import app, { initializeApp } from "./app";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await initializeApp();
  app(req, res);
}
