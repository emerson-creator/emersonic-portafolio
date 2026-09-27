import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Block from "@/components/case-study/Block";
import Reveal from "@/components/ui/Reveal";
import ScrambleText from "@/components/ui/ScrambleText";
import TypeText from "@/components/ui/TypeText";
import { caseStudies } from "@/data/case-studies";
import { visibleProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return visibleProjects
    .filter((p) => p.hasCaseStudy && caseStudies[p.slug])
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = visibleProjects.find((p) => p.slug === slug);
  const study = caseStudies[slug];
  if (!project || !study) return {};
  return { title: `${project.title} · Case study`, description: study.summary };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = visibleProjects.find((p) => p.slug === slug);
  const study = caseStudies[slug];
  if (!project || !study) notFound();

  return (
    <main>
      <article>
        <header className="px-gutter pb-12 pt-32 md:pt-28">
          <Link
            href="/#projects"
            className="font-mono text-xs uppercase underline underline-offset-4"
          >
            Back to projects
          </Link>

          <h1 className="mt-10 text-[clamp(3.5rem,13vw,11rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            <ScrambleText text={project.title} />
          </h1>

          <div className="mt-10 grid gap-5 md:grid-cols-[17rem_minmax(0,34rem)] md:gap-x-8">
            <TypeText
              as="p"
              text={`[${project.kind}]`}
              delay={600}
              className="font-mono text-[0.78rem] uppercase"
            />
            <p className="text-[clamp(1.1rem,2vw,1.5rem)] leading-snug">
              {study.summary}
            </p>
          </div>

          <dl className="mt-12 grid gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-2 md:grid-cols-4">
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-xs uppercase text-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1 leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {project.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase">
              {project.links.map((link) => (
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
            </ul>
          )}
        </header>

        <div className="grid gap-x-8 gap-y-8 border-t border-border px-gutter py-12 md:grid-cols-[17rem_minmax(0,1fr)]">
          <nav
            aria-label="On this page"
            className="md:sticky md:top-6 md:self-start"
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase md:flex-col">
              {study.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-[48rem] space-y-16">
            {study.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-8"
              >
                <h2
                  id={`${section.id}-title`}
                  className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-none tracking-[-0.03em]"
                >
                  {section.title}
                </h2>
                <Reveal className="mt-6 space-y-6">
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </Reveal>
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
