import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "amber";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-cyan text-void shadow-[0_0_0_1px_rgb(34_211_238/0.5),0_8px_30px_-8px_rgb(34_211_238/0.7)] hover:bg-cyan-soft",
  secondary:
    "border border-line-strong bg-surface-raised/80 text-ink hover:border-cyan/60 hover:bg-surface-high",
  ghost: "text-ink-muted hover:bg-surface-raised hover:text-ink",
  amber:
    "bg-amber text-void shadow-[0_0_0_1px_rgb(245_165_36/0.5),0_8px_30px_-8px_rgb(245_165_36/0.6)] hover:bg-amber-soft",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-3.5 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-13 gap-2.5 px-6 text-base",
};

const BASE =
  "inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-[background-color,border-color,color,transform,box-shadow] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function buttonClasses({ variant = "primary", size = "md", className }: Omit<StyleProps, "children">) {
  return cn(BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);
}

type ButtonProps = StyleProps & ComponentPropsWithoutRef<"button">;

export function Button({ variant, size, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = StyleProps & ComponentPropsWithoutRef<typeof Link>;

export function ButtonLink({ variant, size, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}
