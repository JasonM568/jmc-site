"use client";

import { useState } from "react";

// 乾貨（贈品）設定 —— 之後把這裡換成你真正的乾貨名稱即可
const LEAD_MAGNET_TITLE = "《AI 導入實戰檢查清單》";
// 若你有直接下載連結（例如把 PDF 放到 public/downloads/ 下），
// 在 Vercel 設 NEXT_PUBLIC_LEAD_MAGNET_URL，成功後就會顯示下載按鈕。
const LEAD_MAGNET_URL = process.env.NEXT_PUBLIC_LEAD_MAGNET_URL || "";

type Status = "idle" | "sending" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "訂閱失敗，請稍後再試");
      }
    } catch {
      setStatus("error");
      setErrorMsg("連線失敗，請稍後再試");
    }
  }

  return (
    <section id="newsletter" className="px-6 py-20 bg-gradient-to-b from-[#FFFBF5] to-orange-50">
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
          免費索取
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-stone-900 mb-4">
          留下 email，免費領取
          <br className="md:hidden" />
          {LEAD_MAGNET_TITLE}
        </h2>
        <p className="text-stone-500 leading-relaxed mb-8">
          我把陪 50+ 家企業導入 AI 的實戰經驗，整理成一份可以直接照做的檢查清單。
          <br className="hidden md:block" />
          同時你也會收到我不定期分享的 AI 落地乾貨，隨時可退訂。
        </p>

        {status === "success" ? (
          <div className="bg-white border border-orange-200 rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">收到了，謝謝你！</h3>
            {LEAD_MAGNET_URL ? (
              <>
                <p className="text-stone-500 mb-5">點下方按鈕即可下載，內容也會寄到你的信箱。</p>
                <a
                  href={LEAD_MAGNET_URL}
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-orange-200"
                >
                  立即下載 ↓
                </a>
              </>
            ) : (
              <p className="text-stone-500">
                下載連結與確認信會寄到 <span className="font-medium text-stone-700">{email}</span>，
                請留意收件匣（也記得看一下垃圾郵件夾）。
              </p>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="你的 email"
              className="flex-1 border border-stone-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-8 py-3.5 rounded-full transition-colors whitespace-nowrap shadow-lg shadow-orange-200"
            >
              {status === "sending" ? "傳送中..." : "免費領取 →"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-500 text-sm mt-4">{errorMsg}</p>
        )}
        {status !== "success" && (
          <p className="text-xs text-stone-400 mt-4">我們重視你的隱私，不會濫發信件，隨時可一鍵退訂。</p>
        )}
      </div>
    </section>
  );
}
