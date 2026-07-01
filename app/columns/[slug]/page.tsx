import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getColumn, getColumnSlugs, formatDate } from "@/lib/columns";

export function generateStaticParams() {
  return getColumnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) return { title: "找不到文章 | 陳孟宏" };
  return {
    title: `${column.title} | 陳孟宏`,
    description: column.excerpt,
    openGraph: {
      title: column.title,
      description: column.excerpt,
      type: "article",
      publishedTime: column.date,
    },
  };
}

export default async function ColumnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <article className="px-6 py-14 md:py-20">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/columns"
              className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-orange-600 transition-colors mb-8"
            >
              ← 回專欄列表
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {column.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-4">
              {column.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-stone-400 mb-10 pb-8 border-b border-orange-100">
              <span>{column.author}</span>
              <span>·</span>
              <span>{formatDate(column.date)}</span>
              <span>·</span>
              <span>閱讀約 {column.readingTime} 分鐘</span>
            </div>

            <div
              className="prose prose-stone max-w-none prose-headings:font-bold prose-headings:text-stone-900 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-stone-900 prose-code:text-orange-700 prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-blockquote:border-orange-300 prose-blockquote:text-stone-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: column.html }}
            />

            {/* CTA */}
            <div className="mt-16 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-8 text-center border border-orange-100">
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                想聊聊你的 AI 導入或學 Vibe Coding？
              </h3>
              <p className="text-stone-500 mb-6">預約免費 30 分鐘諮詢，我們一起找出最適合你的路。</p>
              <Link
                href="/#contact"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-orange-200"
              >
                預約免費諮詢 →
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
