"use client";

import ScrambleText from "@/components/ui/ScrambleText";
import TypeText from "@/components/ui/TypeText";
import Reveal from "@/components/ui/Reveal";
import useInView from "@/hooks/useInView";
import { contact } from "@/data/profile";

export default function Contact() {
  const { ref, inView } = useInView<HTMLElement>(0.25);

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-title"
      className="border-t border-border px-gutter py-[clamp(3rem,9vh,6rem)]"
    >
      <h2
        id="contact-title"
        className="text-[clamp(3.5rem,11vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]"
      >
        <ScrambleText text="Contact" active={inView} />
      </h2>

      <TypeText
        as="p"
        text={contact.status}
        active={inView}
        delay={500}
        className="mt-8 font-mono text-[0.78rem] uppercase"
      />

      <Reveal delay={200}>
        <a
          href={`mailto:${contact.email}`}
          className="mt-10 block text-[clamp(1.75rem,6.5vw,6rem)] font-semibold leading-none tracking-[-0.04em] [overflow-wrap:anywhere] underline decoration-2 underline-offset-[0.12em] transition-colors motion-reduce:transition-none hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background"
        >
          {contact.email}
        </a>
      </Reveal>

      <Reveal
        as="ul"
        delay={400}
        className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase"
      >
        {contact.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              {link.label}
            </a>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
