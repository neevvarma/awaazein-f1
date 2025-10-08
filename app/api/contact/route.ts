// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name = "", email = "", subject = "", message = "", token = "" } = await req.json();

    // Honeypot
    if (token) return NextResponse.json({ ok: true });

    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Email and message are required." },
        { status: 400 }
      );
    }

    const safe = (s: string) =>
      String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string));

    const from = process.env.RESEND_FROM || "Awaazein Contact <no-reply@your-domain.com>";
    const to = process.env.CONTACT_TO || "awaazeinexec@gmail.com";
    const sub = subject?.trim() || "New message";

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
        <h2 style="margin:0 0 8px">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safe(name)}</p>
        <p><strong>Email:</strong> ${safe(email)}</p>
        <p><strong>Subject:</strong> ${safe(sub)}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:12px 0" />
        <p style="white-space:pre-wrap">${safe(message)}</p>
      </div>
    `;
    const text = `New Contact Form Submission
Name: ${name}
Email: ${email}
Subject: ${sub}

${message}
`;

    const sent = await resend.emails.send({
      from,
      to,
      replyTo: email, // ✅ correct key
      subject: `Contact Form: ${sub}`,
      html,
      text,
    });

    if ((sent as any)?.error) {
      return NextResponse.json(
        { ok: false, error: (sent as any).error.message || "Email send failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
