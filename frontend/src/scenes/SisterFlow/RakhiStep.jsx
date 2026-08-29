import { useEffect, useState } from "react";
import StepShell from "../../components/ui/StepShell.jsx";
import Rakhi from "../../components/rakhi/Rakhi.jsx";
import Button from "../../components/ui/Button.jsx";
import DiyaLayer from "../../components/decor/DiyaLayer.jsx";
import GuideCharacter from "../../components/guide/GuideCharacter.jsx";
import { useAudio } from "../../components/audio/AudioManager.jsx";

export default function RakhiStep({ onNext, onBack, active = true }) {
  const [sent, setSent] = useState(false);
  const { play } = useAudio();

  useEffect(() => {
    if (!active) {
      setSent(false);
    }
  }, [active]);

  const handleSend = () => {
    if (sent) return;
    play("chime");
    setSent(true);
    setTimeout(() => {
      play("whoosh");
      onNext();
    }, 750);
  };

  return (
    <StepShell hideNext>
      <div className="pointer-events-none absolute left-1/2 top-4 md:top-6 -translate-x-1/2 z-20">
        <GuideCharacter size={72} mood={sent ? "excited" : "happy"} />
      </div>

      <div className="absolute inset-0 z-0">
        <DiyaLayer count={5} />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-6 md:pt-10">
        <p className="mb-6 font-display text-2xl text-wine">
          A rakhi, chosen for him
        </p>

        <Rakhi sent={sent} />

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={sent}
            onClick={() => {
              if (sent) return;
              play("paper");
              onBack();
            }}
            className="px-5 py-2.5 font-body text-sm text-wine/70 hover:text-wine transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <Button onClick={handleSend} disabled={sent}>
            Send the Rakhi
          </Button>
        </div>
      </div>
    </StepShell>
  );
}
