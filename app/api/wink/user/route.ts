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
  const clientId = searchParams.get("clientId");
  const token = searchParams.get("token");

  if (typeof clientId !== "string" || typeof token !== "string") {
    return Response.json(
      { error: "Missing or invalid query params: clientId and token are required." },
      { status: 400 }
    );
  }

  try {
    const baseUrl = requireEnv("WINK_IDENTITY_BASE_URL");
    const secret = requireEnv("WINK_IDENTITY_SECRET");

    const response = await fetch(`${baseUrl}/api/ConfidentialClient/verify-client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ClientId: clientId,
        AccessToken: token,
        ClientSecret: secret,
      }),
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
    const message = err instanceof Error ? err.message : "User request failed.";
    if (message.startsWith("Missing required env")) {
      return Response.json(
        { error: "Backend not configured. Set WINK_IDENTITY_* env vars." },
        { status: 503 }
      );
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
