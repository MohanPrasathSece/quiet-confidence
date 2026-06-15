/**
 * authApi.ts
 * Client-side wrapper for the auth serverless functions.
 * All calls use relative /api paths - works both with Vercel deployment
 * and `vercel dev` for local development.
 */

export interface SafeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  howMuchInvested: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: SafeUser;
}

const BASE = "/api/auth";

// ─── Token storage ──────────────────────────────────────────────────

const TOKEN_KEY = "atlasledger_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── API calls ──────────────────────────────────────────────────────

export async function apiSignup(data: {
  name: string;
  email: string;
  phone: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Signup failed");
  return json as AuthResponse;
}

export async function apiSignin(email: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Sign in failed");
  return json as AuthResponse;
}

export async function apiGetMe(): Promise<SafeUser | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    clearToken();
    return null;
  }
  const json = await res.json();
  return json.user as SafeUser;
}
