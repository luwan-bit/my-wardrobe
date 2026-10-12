import { BrandHeader } from "@/components/layout/BrandHeader";
import { PhilosophicalQuote } from "@/components/home/PhilosophicalQuote";
import { DailyImages } from "@/components/home/DailyImages";
import { CircularNav } from "@/components/home/CircularNav";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col bg-white">
      {/* 顶部灰色导航栏 */}
      <div className="w-full bg-[#CCCCCC]">
        <div className="max-w-page mx-auto px-6 py-10 flex flex-col items-center">
          <BrandHeader />
          <PhilosophicalQuote />
        </div>
      </div>

      {/* 下方内容区 */}
      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <DailyImages />
        <CircularNav />
      </div>

      <Footer />
    </main>
  );
}