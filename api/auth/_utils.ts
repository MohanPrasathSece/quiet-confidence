/**
 * api/auth/_utils.ts
 * Shared utilities for Vercel serverless auth functions.
 * Uses Node.js crypto (available in all Vercel Node runtimes).
 */

import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

// ─── JWT ───────────────────────────────────────────────────────────

const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "coffre-dev-secret-change-me-in-prod");

export async function signToken(payload: Record<string, string>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(
  token: string
): Promise<{ sub: string; email: string; firstName: string; lastName: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { sub: string; email: string; firstName: string; lastName: string };
  } catch {
    return null;
  }
}

// ─── Password hashing (PBKDF2) ─────────────────────────────────────

export function generateSalt(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const attempt = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(attempt, "hex"), Buffer.from(hash, "hex"));
}

// ─── Blob key ──────────────────────────────────────────────────────

/** Deterministic blob path for a given email (base64-url encoded) */
export function userBlobKey(email: string): string {
  const encoded = Buffer.from(email.trim().toLowerCase()).toString("base64url");
  return `coffre/users/${encoded}.json`;
}

// ─── ID generation ─────────────────────────────────────────────────

export function generateId(): string {
  return crypto.randomUUID();
}

// ─── CORS helpers ──────────────────────────────────────────────────

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}
