import ScrambleText from "@/components/ui/ScrambleText";
import TypeText from "@/components/ui/TypeText";
import { profile } from "@/data/profile";

const caption = "text-[0.8rem] font-semibold uppercase leading-tight";

export default function Hero() {
  return (
    <section className="flex min-h-[72svh] flex-col justify-end px-gutter pb-8 pt-[clamp(3rem,10vh,7rem)]">
      <h1 className="text-display font-semibold tracking-[-0.05em]">
        <ScrambleText text={profile.name} />
      </h1>

      <div className="mt-[clamp(2rem,7vh,4rem)] grid gap-5 md:grid-cols-[17rem_minmax(0,34rem)_1fr] md:gap-x-8 md:gap-y-6">
        <TypeText
          as="p"
          text={profile.title}
          delay={600}
          className={`${caption} md:col-start-1`}
        />
        <TypeText
          as="p"
          text={profile.summary}
          delay={700}
          className={`${caption} md:col-start-2`}
        />
        <TypeText
          as="p"
          text={profile.code}
          delay={1000}
          className="font-mono text-[0.78rem] md:col-start-1 md:row-start-2"
        />
        <a
          href="#readout"
          aria-label="Scroll to system readout"
          className="justify-self-start self-end md:col-start-3 md:row-start-2 md:justify-self-end"
        >
          <svg
            viewBox="0 0 28 28"
            className="size-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M14 2v23M4 15l10 10 10-10" />
          </svg>
        </a>
      </div>
    </section>
  );
}
