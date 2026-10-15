import { BackButton } from "@/components/ui/BackButton";

type PageHeaderProps = {
  backHref: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function PageHeader({ backHref, backLabel, title, subtitle, right }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <BackButton href={backHref} label={backLabel} />
        {right ? <div className="text-caption text-muted">{right}</div> : null}
      </div>
      <h1 className="font-serif text-title tracking-wide uppercase">{title}</h1>
      {subtitle ? <p className="text-caption text-muted mt-2">{subtitle}</p> : null}
    </div>
  );
}