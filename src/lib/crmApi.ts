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
  countryCode?: string;
  message?: string;
  leadType?: "signup" | "contact";
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

  const countryCode = input.countryCode || "CH";
  const countryPhoneCodes: Record<string, string> = {
    CH: "41", FR: "33", BE: "32", CA: "1", US: "1", GB: "44", DE: "49",
    ES: "34", IT: "39", NL: "31", SE: "46", AU: "61", IN: "91", AE: "971",
    SG: "65", ZA: "27", BR: "55", MX: "52", JP: "81", CY: "357"
  };
  const dialCode = countryPhoneCodes[countryCode] || "41";

  let phone = (input.phone || "").replace(/[^0-9+]/g, '');
  
  // Always ensure phone has the correct country code prefix
  if (phone) {
    // Remove any existing country code to start clean
    if (phone.startsWith('+')) {
      phone = phone.slice(1);
    }
    if (phone.startsWith('00')) {
      phone = phone.slice(2);
    }
    if (phone.startsWith('0') && !phone.startsWith(dialCode)) {
      phone = phone.slice(1);
    }
    
    // Remove the country code if it's already there to avoid duplication
    if (phone.startsWith(dialCode)) {
      phone = phone.slice(dialCode.length);
    }
    
    // Always prepend the correct country code in CRM format (00 + country code)
    phone = '00' + dialCode + phone;
  } else {
    phone = "00" + dialCode + "0000000000";
  }

  const payload: CrmLeadPayload = {
    first_name: first_name,
    last_name: last_name,
    email: input.email.trim(),
    phone: phone,
    country_name: countryCode.toLowerCase(),
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
      const url = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DASHBOARD_URL) || "https://lead-dashboard-orcin.vercel.app/api/increment";
      const leadType = input.leadType || (payload.description && payload.description.toLowerCase().includes("signup") ? "signup" : "contact");
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          website: "AtlasLedger", 
          type: leadType, 
          name: payload.first_name + ' ' + payload.last_name, 
          email: payload.email 
        })
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
