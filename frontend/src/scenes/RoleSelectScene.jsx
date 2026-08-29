import { motion } from "framer-motion";
import DiyaLayer from "../components/decor/DiyaLayer.jsx";
import GuideCharacter from "../components/guide/GuideCharacter.jsx";
import { useAudio } from "../components/audio/AudioManager.jsx";

export default function RoleSelectScene({ onSelect }) {
  const { play } = useAudio();
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-transparent px-6 pb-10 pt-[140px] md:pt-[180px]">
      {/* Centered static guide character layout setup */}
      <div className="pointer-events-none absolute left-1/2 top-[19%] z-20 -translate-x-1/2">
        <GuideCharacter size={72} mood="happy" />
      </div>

      {/* Decorative environment background item assets wrapper */}
      <div className="absolute inset-0 z-0">
        <DiyaLayer count={5} />
      </div>

      {/* Structured core headline string presentation layer */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="font-display text-4xl text-wine">Tell us who you are</h2>
        <p className="mt-2 font-body text-ink/60">
          This shapes the whole letter, so let's start here.
        </p>
      </div>

      <div className="relative z-10 mt-10 flex w-full max-w-md flex-col gap-5 sm:flex-row">
        <RoleCard
          label="I'm Brother"
          sub="Sending a gift to your sister"
          onClick={() => {
            play("bell");
            onSelect("brother");
          }}
        />
        <RoleCard
          label="I'm Sister"
          sub="Sending a rakhi to your brother"
          onClick={() => {
            play("bell");
            onSelect("sister");
          }}
        />
      </div>
    </div>
  );
}

function RoleCard({ label, sub, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }} // Restored natural slight click-press response scale
      className="focus-ring group relative flex-1 rounded-[3px] border border-gold/40 bg-ivory-dim px-6 py-8 text-left shadow-paper"
    >
      <span className="pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full bg-gold-light/70 transition-transform group-hover:scale-150" />
      <p className="font-display text-2xl text-wine">{label}</p>
      <p className="mt-1 font-body text-sm text-ink/60">{sub}</p>
    </motion.button>
  );
}
