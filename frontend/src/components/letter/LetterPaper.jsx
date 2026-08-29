import { motion } from "framer-motion";

export default function LetterPaper({
  children,
  rolling = false,
  className = "",
}) {
  return (
    <motion.div
      initial={{ scaleY: 0.08, opacity: 0.4 }}
      animate={
        rolling
          ? {
              y: 180,
              scaleY: 0.72,
              rotateX: 70,
              opacity: 1,
            }
          : {
              y: 0,
              scaleY: 1,
              rotateX: 0,
              opacity: 1,
            }
      }
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
      className={`relative mx-auto w-full max-w-xl ${className}`}
    >
      <div className="paper-texture relative rounded-[3px] border border-gold/30 bg-ivory px-6 py-8 shadow-paper sm:px-10 sm:py-12">
        {/* torn / deckled top edge, drawn once rather than a generic rounded card */}
        <svg
          className="pointer-events-none absolute -top-2 left-0 w-full text-ivory"
          viewBox="0 0 400 12"
          preserveAspectRatio="none"
          height="12"
        >
          <path
            d="M0 12 Q10 2 20 10 Q30 2 40 10 Q50 2 60 10 Q70 2 80 10 Q90 2 100 10 Q110 2 120 10 Q130 2 140 10 Q150 2 160 10 Q170 2 180 10 Q190 2 200 10 Q210 2 220 10 Q230 2 240 10 Q250 2 260 10 Q270 2 280 10 Q290 2 300 10 Q310 2 320 10 Q330 2 340 10 Q350 2 360 10 Q370 2 380 10 Q390 2 400 10 L400 12 Z"
            fill="currentColor"
          />
        </svg>
        {children}
      </div>
    </motion.div>
  );
}
