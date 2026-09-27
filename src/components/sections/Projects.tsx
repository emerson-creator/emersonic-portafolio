"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ScrambleText from "@/components/ui/ScrambleText";
import TypeText from "@/components/ui/TypeText";
import useInView from "@/hooks/useInView";
import { visibleProjects } from "@/data/projects";

// The row inverts on hover and on keyboard focus, so it works without a mouse too
const invert =
  "transition-colors motion-reduce:transition-none hover:bg-foreground hover:text-background focus-within:bg-foreground focus-within:text-background [&_a:focus-visible]:outline-background";
const dimmed =
  "text-muted group-hover:text-background/70 group-focus-within:text-background/70";

export default function Projects() {
  const { ref, inView } = useInView<HTMLElement>(0.15);

  return (
    <section
      id="projects"
      ref={ref}
      aria-labelledby="projects-title"
      className="flex min-h-svh flex-col border-t border-border pt-[clamp(3rem,9vh,6rem)]"
    >
      <div className="px-gutter">
        <h2
          id="projects-title"
          className="text-[clamp(3.5rem,11vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]"
        >
          <ScrambleText text="Projects" active={inView} />
        </h2>
      </div>

      <ul className="mt-12 flex flex-1 flex-col justify-end border-b border-border">
        {visibleProjects.map((project, index) => (
          <li key={project.slug} className={`${invert} group relative flex-1`}>
            <Reveal
              delay={index * 120}
              className="grid h-full gap-5 border-t border-border px-gutter py-5 md:grid-cols-[12rem_minmax(0,1fr)_15rem] md:items-center md:gap-x-8"
            >
              <span className="font-mono text-xs text-muted group-hover:text-background/70 group-focus-within:text-background/70">
                {String(index + 1).padStart(2, "0")} / {project.kind}
              </span>

              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                  {project.title}
                </h3>
                <TypeText
                  as="p"
                  text={project.description}
                  active={inView}
                  delay={300 + index * 150}
                  className="mt-3 max-w-2xl leading-relaxed"
                />
                <p className={`${dimmed} mt-4 font-mono text-xs uppercase`}>
                  {project.stack.join(" / ")}
                </p>
              </div>

              {(project.hasCaseStudy || project.links.length > 0) && (
                <ul className="flex flex-col gap-2 font-mono text-xs uppercase md:items-end">
                  {project.hasCaseStudy && (
                    <li>
                      <Link
                        href={`/projects/${project.slug}`}
                        aria-label={`View case study: ${project.title}`}
                        className="font-semibold underline underline-offset-4 after:absolute after:inset-0"
                      >
                        View case study
                      </Link>
                    </li>
                  )}
                  {project.links.map((link) => (
                    <li key={link.href} className="relative z-10">
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
                </ul>
              )}
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
