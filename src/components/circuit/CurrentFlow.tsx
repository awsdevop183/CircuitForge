"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useInView, useReducedMotion } from "framer-motion";
import { CIRCUIT_COLORS, type FlowDirection } from "./constants";

interface CurrentFlowProps {
  /** SVG path the charges travel along. Its drawing direction = conventional current direction. */
  d: string;
  /** Whether charge is currently flowing. */
  active: boolean;
  /** Travel speed in SVG units per second. */
  speed?: number;
  /**
   * `conventional` moves along the path (+ → −);
   * `electron` moves against it (− → +).
   */
  direction?: FlowDirection;
  /** Distance between charges along the path. */
  spacing?: number;
  /** Diameter of each moving charge. */
  size?: number;
  color?: string;
  /** Opacity when active, useful for de-emphasising secondary branches. */
  intensity?: number;
}

/**
 * Animated charge carriers moving along a wire path.
 *
 * Uses a round-capped dash pattern whose offset is advanced every frame, so
 * speed changes are smooth (no restarting CSS animations). With reduced motion
 * the charges are shown stationary.
 */
export function CurrentFlow({
  d,
  active,
  speed = 60,
  direction = "conventional",
  spacing = 20,
  size = 5,
  color,
  intensity = 1,
}: CurrentFlowProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const offset = useRef(0);
  const reduceMotion = useReducedMotion();
  const inView = useInView(pathRef, { margin: "80px" });
  const dotColor = color ?? (direction === "electron" ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.amber);

  useAnimationFrame((_, delta) => {
    const path = pathRef.current;
    if (!path || !active || reduceMotion || !inView || speed <= 0) return;
    // Decreasing the dash offset moves dashes forward along the path.
    const sign = direction === "conventional" ? -1 : 1;
    offset.current = (offset.current + (sign * speed * Math.min(delta, 64)) / 1000) % spacing;
    path.style.strokeDashoffset = `${offset.current}`;
  });

  return (
    <motion.path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={dotColor}
      strokeWidth={size}
      strokeLinecap="round"
      strokeDasharray={`0.01 ${spacing}`}
      initial={false}
      animate={{ opacity: active ? intensity : 0 }}
      transition={{ duration: 0.4 }}
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 3px ${dotColor})` }}
    />
  );
}
