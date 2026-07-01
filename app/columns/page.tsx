import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Newsletter from "@/app/components/Newsletter";
import { getAllColumns, formatDate } from "@/lib/columns";

export const metadata: Metadata = {
  title: "專欄 | 陳孟宏",
  description:
    "陳孟宏的知識專欄：AI 導入實戰、Vibe Coding 教學、企業數位轉型的第一手觀察與乾貨分享。",
  openGraph: {
    title: "專欄 | 陳孟宏",
    description: "AI 導入實戰 × Vibe Coding 教學 × 數位轉型觀察",
    type: "website",
  },
};

export default function ColumnsPage() {
  const columns = getAllColumns();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="px-6 pt-16 pb-12 bg-gradient-to-b from-orange-50 to-[#FFFBF5]">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              知識專欄
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4">
              把踩過的坑，變成你的捷徑
            </h1>
            <p className="text-base md:text-lg text-stone-500 leading-relaxed">
              AI 導入實戰、Vibe Coding 教學、數位轉型的第一手觀察。
              <br className="hidden md:block" />
              沒有空話，只有能直接拿去用的乾貨。
            </p>
          </div>
        </section>

        {/* List */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto">
            {columns.length === 0 ? (
              <p className="text-center text-stone-400 py-20">
                專欄文章即將上線，敬請期待。
              </p>
            ) : (
              <ul className="space-y-6">
                {columns.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/columns/${c.slug}`}
                      className="group block bg-white rounded-2xl border border-orange-100 p-6 md:p-8 transition-all hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors mb-2">
                        {c.title}
                      </h2>
                      <p className="text-stone-500 leading-relaxed mb-4 line-clamp-2">
                        {c.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-stone-400">
                        <span>{formatDate(c.date)}</span>
                        <span>·</span>
                        <span>閱讀約 {c.readingTime} 分鐘</span>
                        <span className="ml-auto text-orange-500 font-medium group-hover:translate-x-1 transition-transform">
                          閱讀全文 →
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
