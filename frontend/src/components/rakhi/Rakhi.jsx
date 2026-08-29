import { motion } from "framer-motion";

export default function Rakhi({ size = 160, sent = false }) {
  return (
    <motion.div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      animate={
        sent
          ? { scale: [1, 1.06, 1.06], rotate: [-1, 1, -1] }
          : { rotate: [-2, 2, -2] }
      }
      transition={
        sent
          ? { duration: 0.8, ease: "easeInOut" }
          : { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <div
        className="absolute inset-0 rounded-full blur-lg"
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,79,0.45), transparent 70%)",
        }}
      />
      <svg viewBox="0 0 160 160" width={size} height={size}>
        <defs>
          <radialGradient id="medallion" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#F6D98A" />
            <stop offset="60%" stopColor="#D4A84F" />
            <stop offset="100%" stopColor="#8A6A2C" />
          </radialGradient>
          <linearGradient id="thread" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E88932" />
            <stop offset="100%" stopColor="#6E1737" />
          </linearGradient>
        </defs>

        {/* two side threads that would tie around a wrist */}
        <path
          d="M8 80 Q40 40 78 78"
          stroke="url(#thread)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M152 80 Q120 40 82 78"
          stroke="url(#thread)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* petals radiating from the medallion */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <ellipse
              key={i}
              cx="80"
              cy="80"
              rx="10"
              ry="26"
              fill="#E9A6A9"
              opacity="0.85"
              transform={`rotate(${angle} 80 80) translate(0 -34)`}
            />
          );
        })}

        {/* central medallion */}
        <circle
          cx="80"
          cy="80"
          r="26"
          fill="url(#medallion)"
          stroke="#6E1737"
          strokeWidth="2"
        />
        <circle cx="80" cy="80" r="10" fill="#6E1737" />
        <circle cx="80" cy="80" r="4" fill="#FFF7E8" />

        {/* small beads along the threads */}
        {[
          [30, 62],
          [22, 74],
          [130, 62],
          [138, 74],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="4"
            fill="#E88932"
            stroke="#6E1737"
            strokeWidth="1"
          />
        ))}
      </svg>
    </motion.div>
  );
}
