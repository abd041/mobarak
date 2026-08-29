import { NextResponse } from "next/server";

/**
 * Newsletter subscribe endpoint — prepared for a real provider later
 * (e.g. Mailchimp, Brevo, Klaviyo, Azure Communication).
 *
 * Expected JSON body: { email: string, locale?: string }
 */
export async function POST(request: Request) {
  let body: { email?: string; locale?: string };
  try {
    body = (await request.json()) as { email?: string; locale?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const locale = (body.locale ?? "de").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  // Placeholder for provider integration:
  // await newsletterProvider.subscribe({ email, locale, tags: ["website"] });
  if (process.env.NEWSLETTER_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.NEWSLETTER_API_KEY
            ? { Authorization: `Bearer ${process.env.NEWSLETTER_API_KEY}` }
            : {}),
        },
        body: JSON.stringify({ email, locale, source: "mobarak-website" }),
      });
      if (!res.ok) {
        return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
      }
    } catch {
      return NextResponse.json({ ok: false, error: "provider_unreachable" }, { status: 502 });
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[newsletter] subscribe (demo, no provider configured)", { email, locale });
  }

  return NextResponse.json({ ok: true });
}
