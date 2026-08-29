import { motion } from "framer-motion";

import Button from "../components/ui/Button.jsx";
import DiyaLayer from "../components/decor/DiyaLayer.jsx";
import GuideCharacter from "../components/guide/GuideCharacter.jsx";

function Petal({ delay, left }) {
  return (
    <span
      className="absolute top-[-20px] h-3 w-3 rounded-tl-full rounded-br-full bg-rose/70 animate-drift"
      style={{
        left,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function WelcomeScene({ onBegin }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-ivory via-ivory to-rose/10 px-6 py-10 grain">
      {/* =====================================================
          DIYA DECORATION
      ===================================================== */}
      <DiyaLayer count={5} />

      {/* =====================================================
          FLOATING PETALS
      ===================================================== */}
      {Array.from({ length: 7 }).map((_, i) => (
        <Petal key={i} delay={i * 0.9} left={`${10 + i * 12}%`} />
      ))}

      {/* =====================================================
          GUIDE
          Belongs ONLY to the Welcome screen.
          Horizontally centered, 15% from the top.
      ===================================================== */}
      <motion.div
        className="pointer-events-none absolute top-[15%] z-20"
        
        initial={{
          opacity: 0,
          scale: 0.92,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <GuideCharacter size={72} mood="happy" />
      </motion.div>

      {/* =====================================================
          WELCOME CONTENT
      ===================================================== */}
      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.9,
        }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <h1 className="mt-6 font-display text-5xl italic text-wine sm:text-6xl">
          Happy Raksha Bandhan
        </h1>

        <p className="mt-4 max-w-md font-body text-base text-ink/70 sm:text-lg">
          To every sister who's ever been teased mercilessly by her brother, and
          every brother who's secretly cared more than he ever showed — this
          one's for both of you.
        </p>

        <div className="mt-9">
          <Button variant="primary" onClick={onBegin}>
            Begin the Journey
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
