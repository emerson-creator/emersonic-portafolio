"use client";

import { useEffect, useRef, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>=+";
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

type Props = {
  text: string;
  className?: string;
  delay?: number; // ms before the sequence starts
  stagger?: number; // ms between one letter locking in and the next
  settle?: number; // ms each letter scrambles before it locks in
  active?: boolean; // start scrambling when this becomes true (default: true)
};

export default function ScrambleText({
  text,
  className,
  delay = 0,
  stagger = 110,
  settle = 520,
  active = true,
}: Props) {
  const reduced = useReducedMotion();
  const [glyphs, setGlyphs] = useState<string[] | null>(null); // null = not started
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letters = Array.from(text);

  useEffect(() => {
    if (reduced || !active) return;
    let raf = 0;
    let cancelled = false;
    const els = letterRefs.current;
    const chars = Array.from(text);

    // Wait for the web font so the widths we measure are the real ones
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;

      // Freeze every slot at its final width so random glyphs can't shift the layout
      els.forEach((el) => {
        if (el) el.style.width = `${el.getBoundingClientRect().width}px`;
      });

      const t0 = performance.now() + delay;
      let last = 0;
      let locked = -1;

      const tick = () => {
        const elapsed = performance.now() - t0;
        const isLocked = (i: number) => elapsed - i * stagger >= settle;
        const lockedNow = chars.filter((_, i) => isLocked(i)).length;

        // Change glyphs ~18 times per second: fast enough to feel electric, slow enough to read
        if (elapsed - last > 55 || lockedNow !== locked) {
          last = elapsed;
          locked = lockedNow;
          setGlyphs(
            chars.map((c, i) => (c === " " || isLocked(i) ? c : randomGlyph())),
          );
        }

        if (lockedNow < chars.length) {
          raf = requestAnimationFrame(tick);
        } else {
          // Done: release the fixed widths so the text scales normally on resize
          els.forEach((el) => {
            if (el) el.style.width = "";
          });
        }
      };
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      els.forEach((el) => {
        if (el) el.style.width = "";
      });
    };
  }, [text, reduced, delay, stagger, settle, active]);

  return (
    <span
      className={className}
      data-anim={!reduced && active && glyphs === null ? "pending" : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {letters.map((c, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block text-center"
          >
            {(glyphs ? glyphs[i] : c).replace(" ", "\u00A0")}
          </span>
        ))}
      </span>
    </span>
  );
}
