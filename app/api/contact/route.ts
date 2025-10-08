// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

type Body = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  token?: string; // honeypot
};

const escapeHtml = (s: string) =>
  s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string));

export async function POST(req: Request) {
  try {
    const { name = "", email = "", subject = "", message = "", token = "" } = (await req.json()) as Body;

    // Honeypot: if a hidden field is filled, treat as success silently.
    if (token) return NextResponse.json({ ok: true });

    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Email and message are required." },
        { status: 400 }
      );
    }

    const from = process.env.RESEND_FROM || "Awaazein Contact <no-reply@your-domain.com>";
    const to = process.env.CONTACT_TO || "awaazeinexec@gmail.com";
    const sub = subject.trim() || "New message";

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
        <h2 style="margin:0 0 8px">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(sub)}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:12px 0" />
        <pre style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</pre>
      </div>
    `;

    const text = `New Contact Form Submission
Name: ${name}
Email: ${email}
Subject: ${sub}

${message}
`;

    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: email, // <-- correct key and properly typed
      subject: `Contact Form: ${sub}`,
      html,
      text,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
