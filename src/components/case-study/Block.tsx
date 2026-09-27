import type { Block as BlockType } from "@/data/case-studies/types";
import Image from "next/image";

export default function Block({ block }: { block: BlockType }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-lg leading-relaxed">{block.text}</p>;

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          role="list"
          className="divide-y divide-border border-y border-border"
        >
          {block.items.map((item, i) => (
            <li
              key={item}
              className={`py-3 leading-snug ${block.ordered ? "flex gap-4" : ""}`}
            >
              {block.ordered && (
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 pt-0.5 font-mono text-xs text-muted"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <span>{item}</span>
            </li>
          ))}
        </List>
      );
    }

    case "entries":
      return (
        <ul className="space-y-8">
          {block.items.map((entry) => (
            <li key={entry.title} className="border-l-2 border-foreground pl-5">
              <h3 className="text-xl font-semibold leading-tight tracking-tight">
                {entry.title}
              </h3>
              <p className="mt-2 leading-snug">{entry.body}</p>
              {entry.note && (
                <p className="mt-2 leading-snug text-muted">
                  <span className="mr-2 font-mono text-xs uppercase">
                    {entry.note.label}
                  </span>
                  {entry.note.text}
                </p>
              )}
            </li>
          ))}
        </ul>
      );

    case "diagram":
      return (
        <figure>
          <div
            role="region"
            aria-label={`${block.label} (scrollable)`}
            tabIndex={0}
            className="overflow-x-auto border border-border p-4 md:p-6"
          >
            <pre
              role="img"
              aria-label={block.label}
              className="w-max font-mono text-[0.8rem] leading-tight md:text-sm"
            >
              {block.art}
            </pre>
          </div>
          {block.caption && (
            <figcaption className="mt-3 font-mono text-xs text-muted">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "code":
      return (
        <figure>
          <figcaption className="font-mono text-xs uppercase text-muted">
            {block.label}
          </figcaption>
          <pre
            tabIndex={0}
            className="mt-2 overflow-x-auto border border-border p-4 font-mono text-sm leading-relaxed"
          >
            <code>{block.code}</code>
          </pre>
        </figure>
      );

    case "image": {
      const aspectRatio = block.aspect ?? "16 / 9";

      if (!block.src) {
        // Sin imagen todavía: el hueco solo se ve en desarrollo
        if (process.env.NODE_ENV === "production") return null;
        return (
          <figure>
            <div
              style={{ aspectRatio }}
              className="flex flex-col items-center justify-center gap-2 border border-dashed border-muted p-6 text-center font-mono text-xs text-muted"
            >
              <span className="uppercase">
                Image pending (only visible in development)
              </span>
              {block.hint && <span>{block.hint}</span>}
            </div>
            {block.caption && (
              <figcaption className="mt-3 font-mono text-xs text-muted">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      }

      return (
        <figure>
          <div
            style={{ aspectRatio }}
            className="relative border border-border"
          >
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(min-width: 768px) 48rem, 100vw"
              className={`object-contain ${block.srcDark ? "dark:hidden" : ""}`}
            />
            {block.srcDark && (
              <Image
                src={block.srcDark}
                alt={block.alt}
                fill
                sizes="(min-width: 768px) 48rem, 100vw"
                className="hidden object-contain dark:block"
              />
            )}
          </div>
          {block.caption && (
            <figcaption className="mt-3 font-mono text-xs text-muted">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }
  }
}
