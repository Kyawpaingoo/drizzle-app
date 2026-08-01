import { Context, Next } from "hono";
import { Env } from "../types/hono";
import { auth } from "../lib/auth";

export const sessionMiddleware = async (c: Context<Env>, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
}

export const requireAuth = async (c: Context<Env>, next: Next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return next();
}
