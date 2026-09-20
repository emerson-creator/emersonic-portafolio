"use client";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: the theme still changes for this visit */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="cursor-pointer font-mono text-xs uppercase underline-offset-4 hover:underline"
    >
      <span className="dark:hidden">[Dark]</span>
      <span className="hidden dark:inline">[Light]</span>
    </button>
  );
}
