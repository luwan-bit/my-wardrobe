import { BrandHeader } from "@/components/layout/BrandHeader";
import { PhilosophicalQuote } from "@/components/home/PhilosophicalQuote";
import { DailyImages } from "@/components/home/DailyImages";
import { CircularNav } from "@/components/home/CircularNav";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col">
      {/* 顶部灰色导航栏 - 只放标题 */}
      <div className="w-full header-bar">
        <div className="max-w-page mx-auto px-6 py-10 flex flex-col items-center">
          <BrandHeader />
        </div>
      </div>

      {/* 英文短句放在灰色栏外面 */}
      <div className="max-w-page mx-auto w-full px-6 pt-4">
        <PhilosophicalQuote />
      </div>

      {/* 下方内容区 */}
      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <DailyImages />
        <CircularNav />
      </div>

      <Footer />
    </main>
  );
}