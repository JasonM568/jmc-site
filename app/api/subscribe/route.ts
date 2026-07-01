import { NextResponse } from "next/server";

// 簡單的 email 格式驗證
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, error: "格式錯誤" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "請輸入正確的 email" }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  // 尚未設定金鑰時，不讓流程壞掉（方便本機開發／尚未接好平台時）
  if (!apiKey) {
    console.warn("[subscribe] MAILERLITE_API_KEY 未設定，收到訂閱但未寫入平台：", email);
    return NextResponse.json({
      ok: true,
      pending: true,
      message: "已收到（尚未連接電子報平台）",
    });
  }

  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    // 422 通常是 email 已存在或驗證問題，對使用者當作成功處理較友善
    if (res.status === 422) {
      return NextResponse.json({ ok: true, already: true });
    }

    const detail = await res.text();
    console.error("[subscribe] MailerLite 錯誤", res.status, detail);
    return NextResponse.json(
      { ok: false, error: "訂閱失敗，請稍後再試" },
      { status: 502 },
    );
  } catch (err) {
    console.error("[subscribe] 例外", err);
    return NextResponse.json(
      { ok: false, error: "伺服器忙碌中，請稍後再試" },
      { status: 500 },
    );
  }
}
