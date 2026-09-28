"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin bar under the site header showing how far through the lesson the learner has read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <div className="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent" aria-hidden="true">
      <motion.div className="h-full origin-left bg-gradient-to-r from-cyan to-amber shadow-[0_0_8px_rgb(34_211_238/0.8)]" style={{ scaleX }} />
    </div>
  );
}
