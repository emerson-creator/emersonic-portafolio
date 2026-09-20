// Zero-width, so it overlays the next character instead of pushing the text around
export default function Cursor() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-block w-0 after:absolute after:bottom-[0.15em] after:left-0 after:h-[1em] after:w-[0.55em] after:bg-foreground motion-safe:after:animate-blink"
    />
  );
}
