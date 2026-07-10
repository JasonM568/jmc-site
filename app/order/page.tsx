import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { menuMeta } from "@/content/menu";
import OrderForm from "./OrderForm";

export const metadata: Metadata = {
  title: `${menuMeta.title} | 陳孟宏`,
  description: menuMeta.subtitle,
};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 bg-gradient-to-b from-orange-50 to-[#FFFBF5] min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
              線上登記
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2">
              {menuMeta.title}
            </h1>
            <p className="text-stone-500 mt-4">{menuMeta.subtitle}</p>
          </div>
          <OrderForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
