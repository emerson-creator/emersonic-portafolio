"use client";

import type { ElementType, ReactNode } from "react";
import useInView from "@/hooks/useInView";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number; // ms
  active?: boolean; // if given, it replaces the viewport observer (e.g. a carousel slide)
};

export default function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  active,
}: Props) {
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const shown = active ?? inView;

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={shown ? "shown" : "hidden"}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
