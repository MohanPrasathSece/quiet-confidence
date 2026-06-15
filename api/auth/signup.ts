/**
 * POST /api/auth/signup
 *
 * Body: { firstName, lastName, email, phone, country, howMuchInvested, password }
 * Stores user as a JSON blob in Vercel Blob storage.
 * Returns: { token, user }
 */

import { put, head } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  corsHeaders,
  generateId,
  generateSalt,
  hashPassword,
  signToken,
  userBlobKey,
} from "./_utils";

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  howMuchInvested?: string;
  passwordHash?: string;
  passwordSalt?: string;
  createdAt: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
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
    const { name, email, phone } = req.body as {
      name: string;
      email: string;
      phone: string;
    };

    // ── Validation ──────────────────────────────────────────────────
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const blobKey = userBlobKey(email);

    // ── Check if user already exists ────────────────────────────────
    try {
      await head(blobKey);
      // If head() succeeds, user exists
      return res.status(409).json({ error: "An account with this email already exists" });
    } catch {
      // head() throws if blob not found — that's fine, proceed with creation
    }

    // ── Parse name and create user ─────────────────────────────────
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    const user: UserRecord = {
      id: generateId(),
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };

    // ── Store in Vercel Blob ─────────────────────────────────────────
    await put(blobKey, JSON.stringify(user), {
      access: "public",           // required by Vercel Blob
      contentType: "application/json",
      addRandomSuffix: false,     // deterministic key = can be fetched by email
    });

    // ── Sign JWT & return ────────────────────────────────────────────
    const token = await signToken({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error("[signup] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
