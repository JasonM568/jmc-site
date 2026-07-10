"use client";

import { useMemo, useState } from "react";
import { menu, menuMeta } from "@/content/menu";

const PHONE_RE = /^[0-9+\-\s()]{6,20}$/;

export default function OrderForm() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const allItems = useMemo(() => menu.flatMap((c) => c.items), []);

  const chosen = allItems.filter((i) => selected[i.id]);
  const total = chosen.reduce((sum, i) => sum + (i.price ?? 0), 0);

  function toggle(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();

    if (!name) {
      setErrorMsg("請填寫姓名");
      return;
    }
    if (!PHONE_RE.test(phone)) {
      setErrorMsg("請填寫正確的電話號碼");
      return;
    }
    if (chosen.length === 0) {
      setErrorMsg("請至少勾選一項餐點");
      return;
    }

    setStatus("sending");
    const payload = {
      name,
      phone,
      note,
      items: chosen.map((i) => ({ id: i.id, name: i.name, price: i.price ?? null })),
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("done");
        form.reset();
        setSelected({});
      } else {
        const body = await res.json().catch(() => null);
        setErrorMsg(body?.error || "送出失敗，請稍後再試");
        setStatus("error");
      }
    } catch {
      setErrorMsg("網路忙碌中，請稍後再試");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 md:p-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">登記成功！</h3>
        <p className="text-stone-500">我們已收到你的餐點登記，感謝你的訂購。</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 inline-block text-sm font-semibold px-6 py-2.5 rounded-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors"
        >
          再登記一筆 →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 md:p-10 space-y-8"
    >
      {/* 姓名 / 電話 */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">姓名 *</label>
          <input
            name="name"
            required
            placeholder="你的稱呼"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[#FFFBF5]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">電話 *</label>
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            placeholder="0912-345-678"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[#FFFBF5]"
          />
        </div>
      </div>

      {/* 餐點勾選 */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <label className="block text-sm font-medium text-stone-700">勾選餐點 *</label>
          <span className="text-xs text-stone-400">
            已選 {chosen.length} 項
          </span>
        </div>

        <div className="space-y-6">
          {menu.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">
                {cat.category}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {cat.items.map((item) => {
                  const isOn = !!selected[item.id];
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                        isOn
                          ? "border-orange-400 bg-orange-50"
                          : "border-stone-200 bg-[#FFFBF5] hover:border-orange-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isOn}
                        onChange={() => toggle(item.id)}
                        className="w-4 h-4 accent-orange-500 shrink-0"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-stone-800 font-medium truncate">
                          {item.name}
                        </span>
                        {item.desc && (
                          <span className="block text-xs text-stone-400">{item.desc}</span>
                        )}
                      </span>
                      {menuMeta.showPrices && typeof item.price === "number" && (
                        <span className="text-sm text-stone-500 shrink-0">
                          {menuMeta.currency}
                          {item.price}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 備註 */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">備註（選填）</label>
        <textarea
          name="note"
          rows={3}
          placeholder="有特殊需求可以寫在這，例如「不要香菜」「取餐時間」等…"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[#FFFBF5] resize-none"
        />
      </div>

      {/* 金額小計 */}
      {menuMeta.showPrices && (
        <div className="flex items-center justify-between border-t border-orange-100 pt-5">
          <span className="text-sm text-stone-500">金額小計</span>
          <span className="text-xl font-bold text-orange-600">
            {menuMeta.currency}
            {total}
          </span>
        </div>
      )}

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 rounded-xl transition-colors text-base"
      >
        {status === "sending" ? "送出中…" : "送出登記 →"}
      </button>
    </form>
  );
}
