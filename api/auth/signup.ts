/**
 * POST /api/auth/signup
 *
 * Body: { firstName, lastName, email, phone, country, howMuchInvested, password }
 * Stores user as a JSON blob in Vercel Blob storage.
 * Returns: { token, user }
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  corsHeaders,
  generateId,
  generateSalt,
  hashPassword,
  signToken,
  userBlobKey,
  getUser,
  saveUser,
  UserRecord,
} from "./_utils.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return 
    // Fire-and-forget: increment leads count
    try {
      const host = req.headers.host || "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      fetch(`${protocol}://${host}/api/leads-count`, { method: "POST" }).catch((err) =>
        console.warn("[leads-count] Failed to increment:", err)
      );
    } catch (e) {
      console.warn("[leads-count] Error triggering increment:", e);
    }

    res.status(200).setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type")
      .end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { name, email, phone } = req.body as {
      name: string;
      email: string;
      phone: string;
    };

    // ── Validation ──────────────────────────────────────────────────
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Le nom, l'e-mail et le téléphone sont requis" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Adresse e-mail invalide" });
    }

    // ── Check if user already exists ────────────────────────────────
    const existingUser = await getUser(email);
    if (existingUser) {
      return res.status(409).json({ error: "Un compte avec cet e-mail existe déjà" });
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

    // ── Store user ─────────────────────────────────────────
    await saveUser(email, user);

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
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
