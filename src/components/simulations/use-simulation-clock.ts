"use client";

import { useRef, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useFrame } from "@/lib/use-frame";

/**
 * Seconds elapsed while `running`, the element is on screen and the user
 * hasn't asked for reduced motion. Shared by time-based simulations so they
 * stay in step with each other.
 */
export function useSimulationClock<T extends Element>(running = true): [number, RefObject<T | null>] {
  const ref = useRef<T>(null);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (!running || !inView || reduceMotion) return;
    setTime((t) => t + Math.min(delta, 64) / 1000);
  });

  return [time, ref];
}
