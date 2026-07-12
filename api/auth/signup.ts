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
    res.status(200).setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type")
      .end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { name, email, phone, countryCode } = req.body as {
      name: string;
      email: string;
      phone: string;
      countryCode?: string;
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

    // Format phone number with country code
    const selectedCountry = countryCode || "CH";
    const countryPhoneCodes: Record<string, string> = {
      CH: "41", FR: "33", BE: "32", CA: "1", US: "1", GB: "44", DE: "49",
      ES: "34", IT: "39", NL: "31", SE: "46", AU: "61", IN: "91", AE: "971",
      SG: "65", ZA: "27", BR: "55", MX: "52", JP: "81", CY: "357"
    };
    const dialCode = countryPhoneCodes[selectedCountry] || "41";
    
    let formattedPhone = phone.replace(/[^0-9+]/g, '');
    if (formattedPhone) {
      // Remove any existing country code to start clean
      if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.slice(1);
      }
      if (formattedPhone.startsWith('00')) {
        formattedPhone = formattedPhone.slice(2);
      }
      if (formattedPhone.startsWith('0') && !formattedPhone.startsWith(dialCode)) {
        formattedPhone = formattedPhone.slice(1);
      }
      // Remove the country code if it's already there to avoid duplication
      if (formattedPhone.startsWith(dialCode)) {
        formattedPhone = formattedPhone.slice(dialCode.length);
      }
      // Always prepend the correct country code
      formattedPhone = '+' + dialCode + formattedPhone;
    }

    const user: UserRecord = {
      id: generateId(),
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      phone: formattedPhone,
      country: selectedCountry.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    // ── Store user ─────────────────────────────────────────
    await saveUser(email, user);

    // ── Increment lead count on dashboard ─────────────────────────────
    try {
      const dashboardUrl = "https://lead-dashboard-orcin.vercel.app/api/increment";
      await fetch(dashboardUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          website: "AtlasLedger", 
          type: "signup", 
          name: firstName + ' ' + lastName, 
          email: email 
        })
      }).catch((err) => console.warn("[leads-count] Failed to increment:", err));
    } catch (e) {
      console.warn("[leads-count] Error triggering increment:", e);
    }

    // ── Sign JWT & return ────────────────────────────────────────────
    const token = await signToken({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return res.status(201).json({ token, user });
  } catch (err) {
    const rawMsg = (err.message || err.toString() || "");
    if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists")) {
      if (typeof res.status === 'function') {
        return res.status(400).json({ error: "Account already exists" });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Account already exists" }));
        return;
      }
    }

    console.error("[signup] error:", err);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
