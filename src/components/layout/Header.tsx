import Link from "next/link";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { primaryNav, secondaryNav } from "@/data/navigation";

const linkClass = "underline-offset-4 hover:underline";

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-gutter py-5 md:grid md:grid-cols-[1fr_auto_1fr]">
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-semibold tracking-tight"
      >
        <Logo />
        EMERSON
      </Link>

      <nav
        aria-label="Areas"
        className="order-3 w-full md:order-none md:w-auto"
      >
        <ul className="flex gap-6 md:gap-11">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-5 md:justify-self-end md:gap-8">
        <nav aria-label="Main">
          <ul className="flex gap-5 md:gap-8">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
