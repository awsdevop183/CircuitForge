"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Bit } from "@/lib/logic";
import { LOGIC_COLORS, bitColor } from "./constants";

interface SignalWireProps {
  d: string;
  value: Bit;
  /** Show data "marching" along HIGH wires. Default true. */
  flow?: boolean;
  /** Delay (s) before the rising-edge pulse starts, so a change ripples through a circuit. */
  delay?: number;
}

/**
 * A digital signal line: dim when LOW, glowing when HIGH. When it goes
 * 0 → 1 a bright pulse travels along it, so changes visibly ripple through a circuit.
 */
export function SignalWire({ d, value, flow = true, delay = 0 }: SignalWireProps) {
  const reduceMotion = useReducedMotion();
  return (
    <g aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke={bitColor(value)}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 0.3s", filter: value ? `drop-shadow(0 0 4px ${LOGIC_COLORS.high})` : undefined }}
      />
      {value && flow ? (
        <path d={d} fill="none" stroke={LOGIC_COLORS.highSoft} strokeWidth={1.5} strokeDasharray="3 15" strokeLinecap="round" className="logic-flow" opacity={0.8} />
      ) : null}
      {value && !reduceMotion ? (
        <motion.path
          key="pulse"
          d={d}
          fill="none"
          stroke="#ffffff"
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.14 1.2"
          initial={{ strokeDashoffset: 0.14, opacity: 1 }}
          animate={{ strokeDashoffset: -1.06, opacity: [1, 1, 0] }}
          transition={{ duration: 0.55, delay, ease: "easeOut" }}
        />
      ) : null}
    </g>
  );
}
