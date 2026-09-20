"use client";

import TypeText from "@/components/ui/TypeText";
import useInView from "@/hooks/useInView";
import { readout } from "@/data/readout";

const START = 900; // ms after the panel becomes visible
const GAP = 150; // ms between lines
const lineMs = (text: string) => Math.max(320, text.length * 14);

// Labels are padded to the longest one so the values line up (the font is monospace)
const labelWidth = Math.max(...readout.lines.map((l) => l.label.length)) + 1;

// Each line starts when the previous one finishes
const lines = readout.lines
  .map((l) => `> ${l.label.padEnd(labelWidth)}${l.value}`)
  .map((text, i, all) => ({
    text,
    duration: lineMs(text),
    delay: START + all.slice(0, i).reduce((sum, t) => sum + lineMs(t) + GAP, 0),
  }));

export default function Readout() {
  const { ref, inView } = useInView<HTMLElement>(0.3);

  return (
    <section
      id="readout"
      ref={ref}
      aria-label="System readout"
      className="relative mx-gutter mb-gutter flex min-h-88 flex-col justify-between overflow-hidden border border-border bg-linear-to-b from-panel-top to-panel-bottom p-5 md:min-h-104 md:px-6"
    >
      {/* Scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,var(--scanline)_0_1px,transparent_1px_4px)]"
      />

      <div className="relative flex justify-between gap-4 font-mono text-xs uppercase text-muted">
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-foreground"
          />
          <TypeText text={readout.title} active={inView} delay={300} />
        </span>
        <span>{readout.sequence}</span>
      </div>

      <div className="relative mt-8 font-mono text-[clamp(0.78rem,1.6vw,1rem)] leading-[1.9]">
        {lines.map((line, i) => (
          <TypeText
            key={line.text}
            as="div"
            text={line.text}
            active={inView}
            delay={line.delay}
            duration={line.duration}
            cursor
            keepCursor={i === lines.length - 1}
            className="whitespace-pre-wrap"
          />
        ))}
      </div>
    </section>
  );
}
