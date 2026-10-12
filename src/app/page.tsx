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

      <div className="max-w-page mx-auto w-full px-6 pt-4">
        <PhilosophicalQuote />
      </div>

      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <DailyImages />
        <CircularNav />
      </div>

      <Footer />
    </main>
  );
}