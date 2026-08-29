import { motion } from "framer-motion";

export default function Diya({
  style = {},
  scale = 1,
  delay = 0,
  floatDuration = 5,
  floatDistance = 6,
}) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        ...style,
        scale,
      }}
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: [0, -floatDistance, 0, floatDistance * 0.7, 0],
      }}
      transition={{
        opacity: {
          duration: 0.8,
          delay,
          ease: "easeOut",
        },

        y: {
          duration: floatDuration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <svg
        width="34"
        height="40"
        viewBox="0 0 34 40"
        className="overflow-visible"
      >
        {/* Flame glow */}
        <motion.ellipse
          cx="17"
          cy="24"
          rx="13"
          ry="13"
          fill="#F0A25C"
          animate={{
            opacity: [0.07, 0.18, 0.1, 0.16, 0.07],
            scale: [0.9, 1.08, 0.94, 1.05, 0.9],
          }}
          transition={{
            duration: 1.8,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Diya bowl */}
        <ellipse cx="17" cy="30" rx="15" ry="7" fill="#B08A38" />

        <ellipse cx="17" cy="27" rx="12" ry="5" fill="#E88932" />

        {/* Outer flame */}
        <motion.path
          d="M17 22 Q13 14 17 8 Q21 14 17 22 Z"
          fill="#F0A25C"
          className="origin-bottom"
          animate={{
            scaleY: [1, 1.1, 0.92, 1.06, 0.96, 1],

            scaleX: [1, 0.94, 1.06, 0.97, 1.04, 1],

            rotate: [0, -2, 2.5, -1.5, 1, 0],

            x: [0, -0.5, 0.5, -0.3, 0.3, 0],
          }}
          transition={{
            duration: 1.25,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner flame */}
        <motion.path
          d="M17 18 Q15 13 17 9 Q19 13 17 18 Z"
          fill="#FFF3D0"
          className="origin-bottom"
          animate={{
            scaleY: [1, 1.15, 0.88, 1.08, 0.94, 1],

            scaleX: [1, 0.9, 1.08, 0.94, 1.05, 1],

            rotate: [0, 2, -2.5, 1.5, -1, 0],
          }}
          transition={{
            duration: 0.9,
            delay: delay + 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
}
