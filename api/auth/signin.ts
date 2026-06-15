/**
 * POST /api/auth/signin
 *
 * Body: { email, password }
 * Looks up user blob by email, verifies password, returns JWT.
 * Returns: { token, user }
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { corsHeaders, signToken, userBlobKey, verifyPassword, getUser, UserRecord } from "./_utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type")
      .end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body as { email: string };

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // ── Fetch user ─────────────────────────────────────────────
    const user = await getUser(email);
    if (!user) {
      return res.status(401).json({ error: "No account found with this email" });
    }

    // ── Sign JWT & return ────────────────────────────────────────────
    const token = await signToken({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("[signin] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
