import { BackButton } from "@/components/ui/BackButton";

export default function SettingsPage() {
  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8"><BackButton href="/" /></div>
        <h1 className="font-serif text-title mb-2">SETTINGS</h1>
        <p className="text-caption text-muted mb-10">设置</p>
        <div className="border border-border p-8 text-center text-muted">设置功能将在后续阶段完善。</div>
      </div>
    </main>
  );
}
