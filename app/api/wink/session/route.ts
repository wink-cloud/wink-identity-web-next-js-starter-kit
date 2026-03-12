import { NextRequest } from "next/server";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value?.trim()) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value.trim();
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const returnUrl = searchParams.get("returnUrl");
  const cancelUrl = searchParams.get("cancelUrl");

  if (typeof returnUrl !== "string" || typeof cancelUrl !== "string") {
    return Response.json(
      { error: "Missing or invalid query params: returnUrl and cancelUrl are required." },
      { status: 400 }
    );
  }

  try {
    const baseUrl = requireEnv("WINK_IDENTITY_BASE_URL");
    const clientId = requireEnv("WINK_IDENTITY_CLIENT_ID");
    const secret = requireEnv("WINK_IDENTITY_SECRET");

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const response = await fetch(`${baseUrl}/wink/v1/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ returnUrl, cancelUrl }),
    });

    if (!response.ok) {
      return Response.json(
        { error: `Wink API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Session request failed.";
    if (message.startsWith("Missing required env")) {
      return Response.json(
        { error: "Backend not configured. Set WINK_IDENTITY_* env vars." },
        { status: 503 }
      );
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
