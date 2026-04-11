// Edge-runtime compatible HMAC auth using the Web Crypto API.
// No external dependencies, works inside middleware.

const encoder = new TextEncoder();

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

function hexToBytes(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  // Return a plain ArrayBuffer copy so the type satisfies BufferSource strictly.
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
}

// Base64url (JWT-style) avoids issues with "+/=" in cookies.
function b64urlEncode(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? 0 : 4 - (input.length % 4);
  const padded = input + "=".repeat(pad);
  return atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
}

export interface TokenPayload {
  /** Expiration timestamp in milliseconds since epoch. */
  exp: number;
}

export async function signToken(
  payload: TokenPayload,
  secret: string
): Promise<string> {
  const key = await getKey(secret);
  const body = b64urlEncode(JSON.stringify(payload));
  const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const sig = bytesToHex(new Uint8Array(sigBuf));
  return `${body}.${sig}`;
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<boolean> {
  try {
    const [body, sigHex] = token.split(".");
    if (!body || !sigHex) return false;
    const key = await getKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBytes(sigHex),
      encoder.encode(body)
    );
    if (!ok) return false;
    const payload = JSON.parse(b64urlDecode(body)) as TokenPayload;
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export const AUTH_COOKIE_NAME = "portfolio_auth";
export const AUTH_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days
