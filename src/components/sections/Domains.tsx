"use client";

import ScrambleText from "@/components/ui/ScrambleText";
import TypeText from "@/components/ui/TypeText";
import useInView from "@/hooks/useInView";
import { domains, type Domain } from "@/data/domains";

function DomainRow({ domain }: { domain: Domain }) {
  const { ref, inView } = useInView<HTMLElement>(0.25);
  const titleId = `${domain.id}-title`;

  return (
    <section
      id={domain.id}
      ref={ref}
      aria-labelledby={titleId}
      className="border-t border-border px-gutter py-[clamp(3rem,9vh,6rem)]"
    >
      <h2
        id={titleId}
        className="text-[clamp(3.5rem,11vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]"
      >
        <ScrambleText text={domain.title} />
      </h2>

      <div className="mt-10 grid gap-8 md:grid-cols-[17rem_minmax(0,34rem)_1fr] md:gap-x-8">
        <div className="space-y-4">
          <TypeText
            as="p"
            text={domain.tagline}
            active={inView}
            delay={500}
            className="text-[0.8rem] font-semibold uppercase leading-tight"
          />
          <TypeText
            as="p"
            text={domain.code}
            active={inView}
            delay={900}
            className="font-mono text-[0.78rem]"
          />
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {domain.points.map((point) => (
            <li key={point} className="py-3 leading-snug">
              {point}
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap content-start gap-2 md:justify-end">
          {domain.stack.map((tech) => (
            <li
              key={tech}
              className="border border-border px-2 py-1 font-mono text-xs uppercase"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Domains() {
  return (
    <>
      {domains.map((domain) => (
        <DomainRow key={domain.id} domain={domain} />
      ))}
    </>
  );
}
