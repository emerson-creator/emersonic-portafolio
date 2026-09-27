export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-gutter pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 font-mono text-xs uppercase text-muted">
      <span>© {new Date().getFullYear()} Emerson</span>
      <span>Built with Next.js</span>
      <a href="#" className="text-foreground underline underline-offset-4">
        Back to top
      </a>
    </footer>
  );
}
