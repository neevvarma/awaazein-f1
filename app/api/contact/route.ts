// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";

type ContactBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function env(key: string): string | undefined {
  return process.env[key];
}

function validate(body: unknown): { ok: true; data: ContactBody } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid payload." };

  const b = body as Partial<ContactBody>;
  const name = (b.name ?? "").toString().trim();
  const email = (b.email ?? "").toString().trim();
  const subject = (b.subject ?? "").toString().trim();
  const message = (b.message ?? "").toString().trim();

  if (!name || !email || !subject || !message) return { ok: false, error: "All fields are required." };

  // super light email check
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return { ok: false, error: "Please enter a valid email address." };

  // basic size guards
  if (name.length > 120) return { ok: false, error: "Name is too long." };
  if (subject.length > 200) return { ok: false, error: "Subject is too long." };
  if (message.length > 5000) return { ok: false, error: "Message is too long." };

  return { ok: true, data: { name, email, subject, message } };
}

function missingEnv(): string | null {
  const needed = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO", "CONTACT_FROM"];
  const missing = needed.filter((k) => !env(k));
  return missing.length ? missing.join(", ") : null;
}

function htmlTemplate({ name, email, subject, message }: ContactBody): string {
  const safe = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#0b1220">
    <h2 style="margin:0 0 8px 0;">New Contact Form Submission</h2>
    <p style="margin:0 0 16px 0;">You received a new message from the Awaazein website.</p>
    <table style="border-collapse:collapse;">
      <tr><td style="padding:4px 8px;color:#555;">From</td><td style="padding:4px 8px;"><strong>${safe(
        name
      )}</strong> &lt;${safe(email)}&gt;</td></tr>
      <tr><td style="padding:4px 8px;color:#555;">Subject</td><td style="padding:4px 8px;">${safe(subject)}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
    <pre style="white-space:pre-wrap;font-family:inherit;margin:0">${safe(message)}</pre>
  </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const v = validate(body);
    if (!v.ok) {
      return NextResponse.json({ error: v.error }, { status: 400 });
    }

    const missing = missingEnv();
    if (missing) {
      return NextResponse.json(
        {
          error:
            "Email service not configured. Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/CONTACT_TO/CONTACT_FROM.",
        },
        { status: 500 }
      );
    }

    // Build transporter
    const host = env("SMTP_HOST")!;
    const port = Number(env("SMTP_PORT")!);
    const user = env("SMTP_USER")!;
    const pass = env("SMTP_PASS")!;
    const to = env("CONTACT_TO")!;
    const from = env("CONTACT_FROM")!; // e.g. 'Awaazein Contact <no-reply@awaazein26.com>' or your Gmail

    const secure = port === 465;
    const transporter: Transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const { name, email, subject, message } = v.data;

    // Send email to your exec inbox
    await transporter.sendMail({
      from,              // must be a valid sender for your SMTP
      to,                // your destination: awaazeinexec@gmail.com
      replyTo: email,    // user’s email so you can reply
      subject: `Contact Form: ${subject}`,
      html: htmlTemplate(v.data),
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Unexpected error while sending email.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
