export default function Logo({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3 22 20H2Z" />
      <path d="M7 15h10" />
    </svg>
  );
}
