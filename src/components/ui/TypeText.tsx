"use client";

import { useEffect, useState, type ElementType } from "react";
import Cursor from "@/components/ui/Cursor";
import useReducedMotion from "@/hooks/useReducedMotion";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number; // ms before typing starts
  duration?: number; // ms the whole line takes (default: about 9ms per character)
  cursor?: boolean; // show a cursor while typing
  keepCursor?: boolean; // leave it blinking when done
};

export default function TypeText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  duration,
  cursor = false,
  keepCursor = false,
}: Props) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState<number | null>(null); // null = not started

  useEffect(() => {
    if (reduced) return;
    const total = duration ?? Math.max(350, text.length * 9);
    let raf = 0;
    const timer = window.setTimeout(() => {
      const t0 = performance.now();
      const tick = () => {
        const k = Math.min(
          text.length,
          Math.floor(((performance.now() - t0) / total) * text.length),
        );
        setCount(k);
        if (k < text.length) raf = requestAnimationFrame(tick);
      };
      tick();
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, reduced, delay, duration]);

  const shown = reduced || count === null ? text.length : count;
  const showCursor =
    cursor && !reduced && count !== null && (keepCursor || count < text.length);

  return (
    <Tag
      className={className}
      data-anim={!reduced && count === null ? "pending" : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {showCursor && <Cursor />}
        {/* Not-yet-typed characters keep their space, so the layout never jumps */}
        <span className="invisible">{text.slice(shown)}</span>
      </span>
    </Tag>
  );
}
