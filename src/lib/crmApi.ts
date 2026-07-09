/**
 * crmApi.ts
 * ─────────────────────────────────────────────────────────────────
 * Thin wrapper around the affiliate CRM API.
 *
 * Environment variables (set in .env):
 *   VITE_CRM_HOST       - base URL, e.g. https://your-crm.com
 *   VITE_CRM_API_KEY    - affiliate authorization token
 *   VITE_CRM_SOURCE_ID  - lead source tag (default: "website")
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
  name: string;
  email: string;
  phone: string;
  message?: string;
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
    console.warn("[CRM] Missing VITE_CRM_HOST or VITE_CRM_API_KEY - skipping lead submission.");
    return;
  }

  const [first_name, ...lastNameParts] = (input.name || "Unknown").trim().split(" ");
  const last_name = lastNameParts.length > 0 ? lastNameParts.join(" ") : "Lead";

  let phone = (input.phone || "").replace(/[^0-9+]/g, '');
  if (phone) {
    if (phone.startsWith('+')) {
      phone = '00' + phone.slice(1);
    }
    if (phone.startsWith('41') && phone.length === 11) {
      phone = '00' + phone;
    }
    if (!phone.startsWith('0041')) {
      if (phone.startsWith('0') && !phone.startsWith('00')) {
        phone = '0041' + phone.slice(1);
      } else if (!phone.startsWith('00')) {
        phone = '0041' + phone;
      }
    }
  } else {
    phone = "0000000000";
  }

  const payload: CrmLeadPayload = {
    first_name: first_name,
    last_name: last_name,
    email: input.email.trim(),
    phone: phone,
    country_name: "ch",
    description: (input.message ?? "").trim() || "Signup Lead",
    custom_fields: {
      Source_ID: "website",
      How_Much_Invested: "0",
      Outline_Your_Case: (input.message ?? "").trim() || "",
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

  if (res.ok) {
    try {
      const url = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DASHBOARD_URL) || "https://autodigix-leads-dashboard.vercel.app/api/increment";
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: "AtlasLedger", type: payload.description && payload.description.toLowerCase().includes("signup") ? "signup" : "contact", name: payload.first_name + ' ' + payload.last_name, email: payload.email })
      }).catch(() => {});
    } catch(e){}
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CRM API error ${res.status}: ${text}`);
  }
}


function incrementLeadCount() {
  fetch("/api/leads-count", { method: "POST" }).catch((err) =>
    console.warn("[leads-count] Failed to increment:", err)
  );
}
