import { HALF_SPAN, type Point } from "./constants";

/** Build an SVG path string through a list of points, with optional rounded corners. */
export function pathThrough(points: readonly Point[], cornerRadius = 0, closed = false): string {
  if (points.length < 2) return "";
  const pts = closed ? [...points, points[0]!, points[1]!] : points;

  if (cornerRadius <= 0) {
    const [first, ...rest] = points;
    const body = rest.map(([x, y]) => `L ${x} ${y}`).join(" ");
    return `M ${first![0]} ${first![1]} ${body}${closed ? " Z" : ""}`;
  }

  const segments: string[] = [];
  const start = closed ? midpoint(pts[0]!, pts[1]!) : pts[0]!;
  segments.push(`M ${start[0]} ${start[1]}`);

  const lastCornerIndex = closed ? pts.length - 2 : pts.length - 2;
  for (let i = 1; i <= lastCornerIndex; i++) {
    const prev = pts[i - 1]!;
    const corner = pts[i]!;
    const next = pts[i + 1]!;
    const r = Math.min(cornerRadius, distance(prev, corner) / 2, distance(corner, next) / 2);
    const inPoint = towards(corner, prev, r);
    const outPoint = towards(corner, next, r);
    segments.push(`L ${inPoint[0]} ${inPoint[1]}`);
    segments.push(`Q ${corner[0]} ${corner[1]} ${outPoint[0]} ${outPoint[1]}`);
  }

  if (closed) {
    segments.push(`L ${start[0]} ${start[1]} Z`);
  } else {
    const end = pts[pts.length - 1]!;
    segments.push(`L ${end[0]} ${end[1]}`);
  }
  return segments.join(" ");
}

/** A closed rectangular loop path, running clockwise from the top-left corner. */
export function rectLoop(x1: number, y1: number, x2: number, y2: number, cornerRadius = 12): string {
  return pathThrough(
    [
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2],
    ],
    cornerRadius,
    true,
  );
}

/** Absolute terminal positions of a two-terminal part placed at (x, y) with rotation. */
export function terminalsOf(x: number, y: number, rotation = 0): { start: Point; end: Point } {
  const rad = (rotation * Math.PI) / 180;
  const dx = Math.cos(rad) * HALF_SPAN;
  const dy = Math.sin(rad) * HALF_SPAN;
  return {
    start: [round(x - dx), round(y - dy)],
    end: [round(x + dx), round(y + dy)],
  };
}

function midpoint(a: Point, b: Point): Point {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

function towards(from: Point, to: Point, length: number): Point {
  const d = distance(from, to);
  if (d === 0) return from;
  return [from[0] + ((to[0] - from[0]) / d) * length, from[1] + ((to[1] - from[1]) / d) * length];
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
