import { motion } from "framer-motion";
import GuideCharacter from "../guide/GuideCharacter.jsx";
import Button from "./Button.jsx";
import { useAudio } from "../audio/AudioManager.jsx";

export default function StepShell({
  children,
  onNext,
  nextLabel = "Next",
  nextDisabled,
  hideNext,
  className = "",
  scrollable = false,
}) {
  const { play } = useAudio();
  return (
    <div
      className={`flex min-h-[100dvh] flex-col items-center justify-center bg-ivory ${scrollable ? "h-[100dvh] min-h-0 overflow-hidden" : "px-6 py-12"} ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`flex w-full flex-col items-center ${scrollable ? "h-full min-h-0 overflow-y-auto px-6 py-12" : ""}`}
      >
        {children}

        {!hideNext && (
          <div className="mt-10 flex items-center gap-3">
            <GuideCharacter size={36} />
            <Button
              onClick={() => {
                play("chime");
                onNext();
              }}
              disabled={nextDisabled}
            >
              {nextLabel}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
