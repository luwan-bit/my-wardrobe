import { BrandHeader } from "@/components/layout/BrandHeader";
import { PhilosophicalQuote } from "@/components/home/PhilosophicalQuote";
import { DailyImages } from "@/components/home/DailyImages";
import { CircularNav } from "@/components/home/CircularNav";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col">
      <div className="w-full header-bar">
        <div className="max-w-page mx-auto px-6 py-5 flex flex-col items-center">
          <BrandHeader />
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full">
        <div className="pt-6 pb-2">
          <DailyImages />
        </div>

        <div className="max-w-page mx-auto w-full px-6 pb-4">
          <CircularNav />
        </div>

        <div className="max-w-page mx-auto w-full px-6 pt-2 pb-6">
          <PhilosophicalQuote />
        </div>
      </div>

      <Footer />
    </main>
  );
}