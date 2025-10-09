// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // ensure Node runtime (needed for nodemailer)

// Strongly typed payload (no "any")
type Payload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  // Required env vars
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    CONTACT_TO,   // should be "awaazeinexec@gmail.com"
    CONTACT_FROM, // must be the authenticated/allowed sender (often same as SMTP_USER)
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !CONTACT_FROM) {
    return NextResponse.json(
      {
        error:
          "Email service not configured. Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/CONTACT_TO/CONTACT_FROM.",
      },
      { status: 500 }
    );
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for Gmail's 465
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.6;">
      <h2 style="margin:0 0 12px;color:#0aaad1;">New Awaazein Contact Form Message</h2>
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
      <pre style="white-space:pre-wrap;font:inherit;margin:0">${message}</pre>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: CONTACT_FROM,         // must be the verified/login address
      to: CONTACT_TO,             // your team inbox
      replyTo: `${name} <${email}>`, // replies go to the sender
      subject: `Contact Form: ${subject}`,
      html,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    // Hide internals from users, but log to Vercel
    console.error("Email send failed:", err);
    return NextResponse.json(
      { error: "Failed to send. Please try again later." },
      { status: 500 }
    );
  }
}
