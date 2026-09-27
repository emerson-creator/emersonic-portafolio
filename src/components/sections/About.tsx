"use client";

import ScrambleText from "@/components/ui/ScrambleText";
import TypeText from "@/components/ui/TypeText";
import Reveal from "@/components/ui/Reveal";
import useInView from "@/hooks/useInView";
import { about } from "@/data/profile";

export default function About() {
  const { ref, inView } = useInView<HTMLElement>(0.25);

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-title"
      className="border-t border-border px-gutter py-[clamp(3rem,9vh,6rem)]"
    >
      <h2
        id="about-title"
        className="text-[clamp(3.5rem,11vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]"
      >
        <ScrambleText text="About" active={inView} />
      </h2>

      <div className="mt-10 grid gap-8 md:grid-cols-[17rem_minmax(0,1fr)] md:gap-x-8">
        <TypeText
          as="p"
          text="[About me]"
          active={inView}
          delay={500}
          className="font-mono text-[0.78rem] uppercase"
        />
        <div className="max-w-[44rem] space-y-6 text-[clamp(1.25rem,2.4vw,2rem)] leading-tight tracking-[-0.02em]">
          {about.paragraphs.map((paragraph, i) => (
            <Reveal as="p" key={paragraph} delay={i * 150}>
              {paragraph}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
