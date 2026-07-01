import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 諮詢類型代碼 → 中文
const INTEREST_LABELS: Record<string, string> = {
  course: "Vibe Coding 一對一家教課程",
  enterprise: "企業 AI 導入顧問",
  workshop: "AI 工作坊",
  other: "其他",
};

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  let name = "";
  let email = "";
  let interest = "";
  let message = "";
  try {
    const body = await req.json();
    name = String(body?.name ?? "").trim();
    email = String(body?.email ?? "").trim();
    interest = String(body?.interest ?? "").trim();
    message = String(body?.message ?? "").trim();
  } catch {
    return NextResponse.json({ ok: false, error: "格式錯誤" }, { status: 400 });
  }

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "請填寫姓名與正確的 email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "jyuli780@gmail.com";
  const from = process.env.CONTACT_FROM || "諮詢表單 <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY 未設定，收到諮詢但未寄出：", { name, email });
    return NextResponse.json({ ok: true, pending: true });
  }

  const interestLabel = INTEREST_LABELS[interest] || interest || "（未選擇）";
  const html = `
    <div style="font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1c1917;">
      <h2 style="color: #ea580c; margin-bottom: 4px;">🔔 新的諮詢預約</h2>
      <p style="color: #78716c; margin-top: 0;">有人從 jing-ho.tw 送出諮詢表單：</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 8px 0; color:#78716c; width: 90px;">姓名</td><td style="padding: 8px 0; font-weight: 600;">${esc(name)}</td></tr>
        <tr><td style="padding: 8px 0; color:#78716c;">Email</td><td style="padding: 8px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding: 8px 0; color:#78716c;">諮詢類型</td><td style="padding: 8px 0;">${esc(interestLabel)}</td></tr>
        <tr><td style="padding: 8px 0; color:#78716c; vertical-align: top;">想說的話</td><td style="padding: 8px 0; white-space: pre-wrap;">${esc(message) || "（未填寫）"}</td></tr>
      </table>
      <p style="margin-top: 24px; color:#a8a29e; font-size: 13px;">直接回覆這封信即可聯絡對方。</p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `【諮詢預約】${name} — ${interestLabel}`,
        html,
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    const detail = await res.text();
    console.error("[contact] Resend 錯誤", res.status, detail);
    return NextResponse.json({ ok: false, error: "寄送失敗，請稍後再試" }, { status: 502 });
  } catch (err) {
    console.error("[contact] 例外", err);
    return NextResponse.json({ ok: false, error: "伺服器忙碌中，請稍後再試" }, { status: 500 });
  }
}
