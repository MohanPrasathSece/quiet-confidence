/**
 * GET /api/auth/me
 *
 * Header: Authorization: Bearer <jwt>
 * Returns the current user's profile (without password fields).
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { userBlobKey, verifyToken, getUser, UserRecord } from "./_utils.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ── Extract Bearer token ─────────────────────────────────────────
    const authHeader = req.headers["authorization"] as string | undefined;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.slice(7);

    // ── Verify JWT ──────────────────────────────────────────────────
    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // ── Fetch latest user data ────────────────────────────
    const user = await getUser(payload.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { passwordHash: _h, passwordSalt: _s, ...safeUser } = user;
    return res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error("[me] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
