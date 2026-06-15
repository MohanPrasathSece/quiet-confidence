/**
 * crmApi.ts
 * ─────────────────────────────────────────────────────────────────
 * Thin wrapper around the affiliate CRM API.
 *
 * Environment variables (set in .env):
 *   VITE_CRM_HOST       — base URL, e.g. https://your-crm.com
 *   VITE_CRM_API_KEY    — affiliate authorization token
 *   VITE_CRM_SOURCE_ID  — lead source tag (default: "website")
 */

const CRM_HOST = import.meta.env.VITE_CRM_HOST as string;
const CRM_API_KEY = import.meta.env.VITE_CRM_API_KEY as string;
const CRM_SOURCE_ID = (import.meta.env.VITE_CRM_SOURCE_ID as string) ?? "website";

const ENDPOINT = `${CRM_HOST}/api/lead_management/api/affiliates`;

// ─── Types ─────────────────────────────────────────────────────────

export interface CrmLeadPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_name: string;
  description: string;
  custom_fields: {
    Source_ID: string;
    How_Much_Invested: string;
    Outline_Your_Case: string;
  };
}

export interface SubmitLeadInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  howMuchInvested: string;
  outlineCase: string;
  /** Optional override for Source_ID; defaults to VITE_CRM_SOURCE_ID */
  sourceId?: string;
}

// ─── Helper ────────────────────────────────────────────────────────

/**
 * Submit a lead to the CRM affiliate endpoint.
 * Throws on network error or non-2xx response.
 */
export async function submitLead(input: SubmitLeadInput): Promise<void> {
  if (!CRM_HOST || !CRM_API_KEY) {
    console.warn("[CRM] Missing VITE_CRM_HOST or VITE_CRM_API_KEY — skipping lead submission.");
    return;
  }

  const payload: CrmLeadPayload = {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    country_name: input.country.trim().toLowerCase(),
    description: input.outlineCase.trim(),
    custom_fields: {
      Source_ID: input.sourceId ?? CRM_SOURCE_ID,
      How_Much_Invested: input.howMuchInvested,
      Outline_Your_Case: input.outlineCase.trim(),
    },
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: CRM_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CRM API error ${res.status}: ${text}`);
  }
}
