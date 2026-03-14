import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_MS = 5 * 60 * 1000;
const ipLastSent = new Map<string, number>();

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const lastSent = ipLastSent.get(ip);
  if (lastSent && Date.now() - lastSent < RATE_LIMIT_MS) {
    const retryAfter = Math.ceil(
      (RATE_LIMIT_MS - (Date.now() - lastSent)) / 1000,
    );
    return NextResponse.json(
      { error: "Please wait before sending another message." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const { name, email, message, clickCount } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        name,
        email,
        message,
        clickCount: String(clickCount ?? 0),
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[EmailJS] Failed to send:", {
      status: response.status,
      statusText: response.statusText,
      body,
    });
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 },
    );
  }

  ipLastSent.set(ip, Date.now());
  return NextResponse.json({ success: true });
}
