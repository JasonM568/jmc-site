import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-white text-lg">陳孟宏</div>
          <div className="text-sm mt-0.5">AI 導入策略顧問 × Vibe Coding 家教</div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/#about" className="hover:text-orange-400 transition-colors">
            關於我
          </Link>
          <Link href="/columns" className="hover:text-orange-400 transition-colors">
            專欄
          </Link>
          <Link href="/#contact" className="hover:text-orange-400 transition-colors">
            聯絡我
          </Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto text-center md:text-left text-xs text-stone-500 mt-6">
        © 2026 陳孟宏. All rights reserved.
      </div>
    </footer>
  );
}
