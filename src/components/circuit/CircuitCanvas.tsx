"use client";

import { createContext, useContext, useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CIRCUIT_COLORS, PANEL_BACKGROUND } from "./constants";

interface CircuitIds {
  glow: string;
  softGlow: string;
  arrow: string;
}

const CircuitIdsContext = createContext<CircuitIds | null>(null);

/** Unique <defs> ids for the nearest CircuitCanvas (avoids clashes between diagrams). */
export function useCircuitIds(): CircuitIds {
  const ids = useContext(CircuitIdsContext);
  if (!ids) {
    throw new Error("Circuit parts must be rendered inside a <CircuitCanvas>.");
  }
  return ids;
}

interface CircuitCanvasProps {
  /** SVG viewBox, e.g. "0 0 400 260". */
  viewBox: string;
  /** Short accessible name of the diagram. */
  title: string;
  /** Longer accessible description — describe what the learner would see. */
  description?: string;
  /**
   * When true the diagram contains focusable/interactive parts and is exposed
   * as a group rather than a flat image.
   */
  interactive?: boolean;
  /** Background colour used to cut wires under part bodies. */
  background?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Root <svg> for every circuit diagram. Provides shared filters and gradients
 * and an accessible name/description.
 */
export function CircuitCanvas({
  viewBox,
  title,
  description,
  interactive = false,
  background = PANEL_BACKGROUND,
  className,
  style,
  children,
}: CircuitCanvasProps) {
  const reactId = useId().replace(/:/g, "");
  const ids: CircuitIds = {
    glow: `cf-glow-${reactId}`,
    softGlow: `cf-soft-glow-${reactId}`,
    arrow: `cf-arrow-${reactId}`,
  };
  const titleId = `cf-title-${reactId}`;
  const descId = `cf-desc-${reactId}`;

  return (
    <svg
      viewBox={viewBox}
      role={interactive ? "group" : "img"}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className={cn("block h-auto w-full select-none overflow-visible", className)}
      style={{ ["--circuit-bg" as string]: background, ...style }}
    >
      <title id={titleId}>{title}</title>
      {description ? <desc id={descId}>{description}</desc> : null}
      <defs>
        <filter id={ids.glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={ids.softGlow} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <marker
          id={ids.arrow}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CIRCUIT_COLORS.amber} />
        </marker>
      </defs>
      <CircuitIdsContext.Provider value={ids}>{children}</CircuitIdsContext.Provider>
    </svg>
  );
}
