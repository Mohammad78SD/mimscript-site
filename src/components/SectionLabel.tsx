export function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="label flex items-center gap-3">
      <span>{n}</span>
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      <span>{children}</span>
    </p>
  );
}
