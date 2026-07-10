import { NextResponse } from "next/server";
import { menuMeta } from "@/content/menu";

const PHONE_RE = /^[0-9+\-\s()]{6,20}$/;

type OrderItem = { id: string; name: string; price: number | null };

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  let name = "";
  let phone = "";
  let note = "";
  let items: OrderItem[] = [];

  try {
    const body = await req.json();
    name = String(body?.name ?? "").trim();
    phone = String(body?.phone ?? "").trim();
    note = String(body?.note ?? "").trim();
    items = Array.isArray(body?.items)
      ? body.items
          .map((i: unknown) => {
            const it = i as Record<string, unknown>;
            return {
              id: String(it?.id ?? ""),
              name: String(it?.name ?? "").trim(),
              price: typeof it?.price === "number" ? it.price : null,
            };
          })
          .filter((i: OrderItem) => i.name)
      : [];
  } catch {
    return NextResponse.json({ ok: false, error: "格式錯誤" }, { status: 400 });
  }

  if (!name) {
    return NextResponse.json({ ok: false, error: "請填寫姓名" }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ ok: false, error: "請填寫正確的電話號碼" }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "請至少勾選一項餐點" }, { status: 400 });
  }

  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_TO || process.env.CONTACT_TO || "jyuli780@gmail.com";
  const from = process.env.ORDER_FROM || process.env.CONTACT_FROM || "餐點登記 <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[order] RESEND_API_KEY 未設定，收到登記但未寄出：", { name, phone, items });
    return NextResponse.json({ ok: true, pending: true });
  }

  const rows = items
    .map((i) => {
      const priceCell =
        menuMeta.showPrices && typeof i.price === "number"
          ? `${menuMeta.currency}${i.price}`
          : "";
      return `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #f5f5f4;">${esc(i.name)}</td>
        <td style="padding:6px 0;border-bottom:1px solid #f5f5f4;text-align:right;color:#78716c;">${priceCell}</td>
      </tr>`;
    })
    .join("");

  const totalRow = menuMeta.showPrices
    ? `<tr>
        <td style="padding:10px 0;font-weight:600;">合計</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;color:#ea580c;">${menuMeta.currency}${total}</td>
      </tr>`
    : "";

  const html = `
    <div style="font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1c1917;">
      <h2 style="color: #ea580c; margin-bottom: 4px;">🍱 新的餐點登記</h2>
      <p style="color: #78716c; margin-top: 0;">有人送出了「${esc(menuMeta.title)}」：</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
        <tr><td style="padding: 6px 0; color:#78716c; width: 72px;">姓名</td><td style="padding: 6px 0; font-weight: 600;">${esc(name)}</td></tr>
        <tr><td style="padding: 6px 0; color:#78716c;">電話</td><td style="padding: 6px 0;"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
        <tr><td style="padding: 6px 0; color:#78716c; vertical-align: top;">備註</td><td style="padding: 6px 0; white-space: pre-wrap;">${esc(note) || "（未填寫）"}</td></tr>
      </table>
      <h3 style="margin: 20px 0 6px; color:#1c1917;">餐點內容</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows}
        ${totalRow}
      </table>
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
        subject: `【餐點登記】${name}（${items.length} 項${menuMeta.showPrices ? `／${menuMeta.currency}${total}` : ""}）`,
        html,
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    const detail = await res.text();
    console.error("[order] Resend 錯誤", res.status, detail);
    return NextResponse.json({ ok: false, error: "送出失敗，請稍後再試" }, { status: 502 });
  } catch (err) {
    console.error("[order] 例外", err);
    return NextResponse.json({ ok: false, error: "伺服器忙碌中，請稍後再試" }, { status: 500 });
  }
}
