"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/** Longest step a simulation may take in one frame (e.g. after a background tab). */
const MAX_STEP_MS = 64;

/**
 * Runs `callback(time, delta)` once per animation frame, where `delta` is the
 * real time in milliseconds since the previous frame. Every simulation clock
 * in CircuitForge goes through this hook.
 *
 * It uses its own `requestAnimationFrame` loop rather than framer-motion's
 * `useAnimationFrame`: that hook re-subscribes whenever an inline callback
 * changes, and its shared frame loop can invoke subscribers many times per
 * frame — which made simulated time run far too fast (a capacitor "charged"
 * in 0.1 s instead of 11 s).
 */
export function useFrame(callback: (time: number, delta: number) => void) {
  const latest = useRef(callback);
  useLayoutEffect(() => {
    latest.current = callback;
  });
  useEffect(() => {
    let id = 0;
    let previous: number | null = null;
    const start = performance.now();
    const tick = (now: number) => {
      if (previous !== null) latest.current(now - start, Math.min(now - previous, MAX_STEP_MS));
      previous = now;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
}
