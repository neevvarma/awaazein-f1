import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  CONTACT_TO,
  CONTACT_FROM,
} = process.env;

function missingEnv() {
  return !SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !CONTACT_FROM;
}

export async function POST(req: Request) {
  try {
    if (missingEnv()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service not configured. Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/CONTACT_TO/CONTACT_FROM.",
        },
        { status: 500 }
      );
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false otherwise
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
        <h2 style="margin:0 0 8px 0">New Contact Message</h2>
        <p style="margin:0 0 2px 0"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 2px 0"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:12px 0 4px 0"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p style="white-space:pre-wrap;margin:8px 0 0 0">${escapeHtml(message)}</p>
      </div>
    `;

    await transporter.sendMail({
      from: CONTACT_FROM,       // e.g. "Awaazein 2026 <no-reply@awaazein26.com>"
      to: CONTACT_TO,           // e.g. "awaazeinexec@gmail.com"
      replyTo: email,           // user’s email so you can reply directly
      subject: `Contact Form: ${subject}`,
      html,
    });

    // Important: always return JSON on success
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error sending email";
    console.error("CONTACT API ERROR:", err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// basic HTML escape to avoid breaking markup
function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
