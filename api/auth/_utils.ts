/**
 * api/auth/_utils.ts
 * Shared utilities for Vercel serverless auth functions.
 * Uses Node.js crypto (available in all Vercel Node runtimes).
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { SignJWT, jwtVerify } from "jose";
import { put, head, get } from "@vercel/blob";

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

const localDbPath = path.resolve(process.cwd(), "api/auth/.local-db.json");

function readLocalDb(): Record<string, UserRecord> {
  try {
    if (fs.existsSync(localDbPath)) {
      return JSON.parse(fs.readFileSync(localDbPath, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read local DB:", err);
  }
  return {};
}

function writeLocalDb(db: Record<string, UserRecord>) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local DB:", err);
  }
}

export function isDummyToken(): boolean {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return !token || token.includes("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
}

export async function getUser(email: string): Promise<UserRecord | null> {
  const cleanEmail = email.trim().toLowerCase();
  
  if (isDummyToken()) {
    const db = readLocalDb();
    return db[cleanEmail] || null;
  } else {
    try {
      const blobKey = userBlobKey(cleanEmail);
      const blobMeta = await head(blobKey);
      
      // Fetch private blob content using SDK get()
      const getResult = await get(blobMeta.url, { access: "private" });
      if (!getResult || !getResult.stream) return null;
      
      const response = new Response(getResult.stream);
      return await response.json() as UserRecord;
    } catch {
      return null;
    }
  }
}

export async function saveUser(email: string, user: UserRecord): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  
  if (isDummyToken()) {
    const db = readLocalDb();
    db[cleanEmail] = user;
    writeLocalDb(db);
  } else {
    const blobKey = userBlobKey(cleanEmail);
    try {
      // Try public access first (default)
      await put(blobKey, JSON.stringify(user), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      });
    } catch (err: any) {
      // If store is configured as private, retry with private access
      if (err?.message?.includes("private store") || err?.message?.includes("private access")) {
        await put(blobKey, JSON.stringify(user), {
          access: "private",
          contentType: "application/json",
          addRandomSuffix: false,
        });
      } else {
        throw err;
      }
    }
  }
}

// ─── JWT ───────────────────────────────────────────────────────────

const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "atlasledger-dev-secret-change-me-in-prod");

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
  return `atlasledger/users/${encoded}.json`;
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
