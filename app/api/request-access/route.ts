import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, note } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.NOTIFY_EMAIL!,
      subject: `Portfolio access request from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #888;">Portfolio Access Request</p>
          <h2 style="margin: 0 0 24px; font-size: 20px; font-weight: 600; color: #111;">${name} wants access</h2>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; width: 80px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 500;">${name}</td>
            </tr>
            ${email ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #111; font-weight: 500;">${email}</a>
              </td>
            </tr>` : ""}
            ${note ? `
            <tr>
              <td style="padding: 10px 0; color: #888; vertical-align: top;">Note</td>
              <td style="padding: 10px 0; line-height: 1.5;">${note}</td>
            </tr>` : ""}
          </table>

          ${email ? `<a href="mailto:${email}" style="display: inline-block; margin-top: 24px; padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 500;">Reply to ${name}</a>` : ""}
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("request-access error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
