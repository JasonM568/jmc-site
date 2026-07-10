"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#about", label: "關於我" },
  { href: "/#services", label: "服務" },
  { href: "/#course", label: "課程" },
  { href: "/columns", label: "專欄" },
  { href: "/order", label: "餐點登記" },
  { href: "/#testimonials", label: "學員見證" },
  { href: "/#contact", label: "聯絡我" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#FFFBF5]/90 backdrop-blur border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-orange-600 tracking-tight">
          陳孟宏
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-stone-600 hover:text-orange-600 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="ml-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            預約免費諮詢
          </Link>
        </div>
        <button
          className="md:hidden text-stone-700 p-1"
          onClick={() => setOpen(!open)}
          aria-label="開啟選單"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#FFFBF5] border-t border-orange-100 px-6 pb-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-stone-600 hover:text-orange-600 transition-colors border-b border-orange-50 last:border-0"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center bg-orange-500 text-white font-medium py-2.5 rounded-full"
          >
            預約免費諮詢
          </Link>
        </div>
      )}
    </nav>
  );
}
