import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] as string));
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, token } = await req.json();

    // Honeypot (bots will fill this)
    if (typeof token === "string" && token.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const n = (name || "").toString().trim();
    const e = (email || "").toString().trim();
    const sub = ((subject || "").toString().trim()) || "New message";
    const msg = (message || "").toString().trim();

    if (!n || !e || !msg) {
      return NextResponse.json({ ok: false, error: "Please fill out all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }
    if (msg.length > 5000) {
      return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.CONTACT_TO || "awaazeinexec@gmail.com";
    const from = process.env.CONTACT_FROM || "Awaazein F1 <onboarding@resend.dev>";

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.5">
        <p>You received a new message from the website contact form:</p>
        <p><strong>Name:</strong> ${esc(n)}<br/>
           <strong>Email:</strong> ${esc(e)}<br/>
           <strong>Subject:</strong> ${esc(sub)}</p>
        <p><strong>Message:</strong><br/>${esc(msg).replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    await resend.emails.send({
      from,
      to,
      reply_to: e,
      subject: `Contact Form: ${sub}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
