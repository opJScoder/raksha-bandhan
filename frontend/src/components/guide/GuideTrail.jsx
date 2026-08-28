import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GuideCharacter from './GuideCharacter.jsx';

// Sample a quadratic bezier curve from a start point, through a control
// point, to an end point — used both to draw the trail path and to move
// the guide's body along the same curve so the two stay in sync.
function sampleCurve(steps = 24) {
  const p0 = { x: 12, y: 78 };
  const p1 = { x: 50, y: 8 };
  const p2 = { x: 88, y: 78 };
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
    const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
    pts.push({ x, y });
  }
  return pts;
}

/**
 * Full-screen overlay shown briefly between scenes: the guide travels
 * along a curved path, leaving a fading gold + saffron trail, before the
 * next scene is revealed underneath it.
 */
export default function GuideTrail({ active, onComplete, duration = 1.1 }) {
  const points = useMemo(() => sampleCurve(), []);
  const pathD = useMemo(() => {
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
  }, [points]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4A84F" stopOpacity="0" />
                <stop offset="100%" stopColor="#E88932" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#trailGrad)"
              strokeWidth="0.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0.9 }}
              animate={{ pathLength: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration, ease: 'easeInOut' }}
            />
          </svg>

          {/* trailing sparkle particles along the same curve */}
          {points.filter((_, i) => i % 3 === 0).map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-gold-light"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.4] }}
              transition={{ duration: 0.6, delay: (i / (points.length / 3)) * duration }}
            />
          ))}

          {/* the guide itself, moving along the curve */}
          <motion.div
            className="absolute"
            initial={{ left: `${points[0].x}%`, top: `${points[0].y}%`, opacity: 0 }}
            animate={{
              left: points.map((p) => `${p.x}%`),
              top: points.map((p) => `${p.y}%`),
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{ duration, ease: 'easeInOut', times: points.map((_, i) => i / (points.length - 1)) }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <GuideCharacter size={48} mood="excited" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
