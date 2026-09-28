import Link from "next/link";
import { cn } from "@/lib/cn";

/** CircuitForge mark: a chip-like node with glowing traces, plus the wordmark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#0b1018" stroke="#263447" />
      <path d="M4 16h6M22 16h6M16 4v6M16 22v6" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#0f1a26" stroke="#22d3ee" strokeWidth="1.75" />
      <path d="M17.5 12.5 14 16.5h3l-1.5 3.5" fill="none" stroke="#f5a524" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="16" r="1.6" fill="#22d3ee" />
      <circle cx="28" cy="16" r="1.6" fill="#22d3ee" />
      <circle cx="16" cy="4" r="1.6" fill="#22d3ee" />
      <circle cx="16" cy="28" r="1.6" fill="#22d3ee" />
    </svg>
  );
}

export function Logo({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label="CircuitForge home"
    >
      <LogoMark className="transition-transform duration-300 group-hover:rotate-90" />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Circuit<span className="text-cyan">Forge</span>
      </span>
    </Link>
  );
}
