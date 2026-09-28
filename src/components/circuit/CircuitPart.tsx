"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CIRCUIT_COLORS } from "./constants";

export type LabelPlacement = "top" | "bottom" | "left" | "right";

export interface PlacementProps {
  x: number;
  y: number;
  /** Clockwise rotation in degrees. */
  rotation?: number;
}

export interface CircuitPartProps extends PlacementProps {
  /** Name shown on hover/focus and used as the accessible label, e.g. "Resistor". */
  name: string;
  /** Optional detail appended to the hover label, e.g. "220 Ω". */
  detail?: string;
  /** Where the hover label appears relative to the part. */
  labelPlacement?: LabelPlacement;
  /** Distance from the part centre to the hover label. */
  labelOffset?: number;
  /** Make the part reachable with the keyboard so its label can be read. Default true. */
  focusable?: boolean;
  /** Draw attention to the part (e.g. while a lesson is talking about it). */
  highlighted?: boolean;
  children: ReactNode;
}

const LABEL_HEIGHT = 22;
const CHAR_WIDTH = 6.6;

/**
 * Positions a circuit part and adds an accessible hover/focus name tag.
 * The symbol itself is drawn by `children` in the part's local frame.
 */
export function CircuitPart({
  x,
  y,
  rotation = 0,
  name,
  detail,
  labelPlacement = "top",
  labelOffset = 34,
  focusable = true,
  highlighted = false,
  children,
}: CircuitPartProps) {
  const [active, setActive] = useState(false);
  const text = detail ? `${name} · ${detail}` : name;
  const width = Math.max(48, text.length * CHAR_WIDTH + 18);

  const offset = {
    top: [0, -labelOffset - LABEL_HEIGHT / 2],
    bottom: [0, labelOffset + LABEL_HEIGHT / 2],
    left: [-labelOffset - width / 2, 0],
    right: [labelOffset + width / 2, 0],
  }[labelPlacement];

  return (
    <g
      className="circuit-part"
      transform={`translate(${x} ${y})`}
      tabIndex={focusable ? 0 : undefined}
      role={focusable ? "img" : undefined}
      aria-label={focusable ? text : undefined}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <g transform={`rotate(${rotation})`}>
        {/* Invisible hit area makes thin symbols easy to hover and tap */}
        <rect x={-40} y={-22} width={80} height={44} fill="transparent" />
        <rect
          className="circuit-part__focus"
          x={-44}
          y={-26}
          width={88}
          height={52}
          rx={10}
          fill="none"
          stroke={CIRCUIT_COLORS.cyan}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0}
        />
        {highlighted ? (
          <motion.rect
            x={-46}
            y={-28}
            width={92}
            height={56}
            rx={12}
            fill="#22d3ee"
            fillOpacity={0.08}
            stroke={CIRCUIT_COLORS.amber}
            strokeWidth={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            aria-hidden="true"
          />
        ) : null}
        {children}
      </g>
      <AnimatePresence>
        {active ? (
          <motion.g
            key="label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            pointerEvents="none"
            aria-hidden="true"
          >
            <g transform={`translate(${offset![0]} ${offset![1]})`}>
              <rect
                x={-width / 2}
                y={-LABEL_HEIGHT / 2}
                width={width}
                height={LABEL_HEIGHT}
                rx={6}
                fill={CIRCUIT_COLORS.labelBg}
                stroke={CIRCUIT_COLORS.cyan}
                strokeOpacity={0.6}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fontFamily="var(--font-mono)"
                fill={CIRCUIT_COLORS.labelText}
              >
                {text}
              </text>
            </g>
          </motion.g>
        ) : null}
      </AnimatePresence>
    </g>
  );
}

/** Common props accepted by every placed part. */
export type PartProps = PlacementProps &
  Partial<Pick<CircuitPartProps, "name" | "detail" | "labelPlacement" | "labelOffset" | "focusable" | "highlighted">>;
