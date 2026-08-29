import { AnimatePresence, motion } from "framer-motion";
import GuideCharacter from "./GuideCharacter.jsx";

export default function GuideTrail({ active, onComplete, duration = 1.2 }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Guide starts near the top and travels horizontally */}
          <motion.div
            className="absolute left-[12%] top-[12%]"
            initial={{
              x: 0,
              opacity: 0,
            }}
            animate={{
              x: ["0vw", "8vw", "25vw", "42vw"],
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              duration,
              ease: "easeInOut",
              times: [0, 0.15, 0.55, 1],
            }}
            onAnimationComplete={onComplete}
          >
            <GuideCharacter size={48} mood="excited" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
