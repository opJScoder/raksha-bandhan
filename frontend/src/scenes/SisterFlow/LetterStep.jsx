import { useEffect, useMemo, useState } from "react";
import StepShell from "../../components/ui/StepShell.jsx";
import LetterPaper from "../../components/letter/LetterPaper.jsx";
import LetterWritingEngine from "../../components/letter/LetterWritingEngine.jsx";
import Rakhi from "../../components/rakhi/Rakhi.jsx";
import DiyaLayer from "../../components/decor/DiyaLayer.jsx";
import GuideCharacter from "../../components/guide/GuideCharacter.jsx";
import { useAudio } from "../../components/audio/AudioManager.jsx";
import { sisterLetter } from "../../lib/letterContent.js";

export default function LetterStep({
  senderName,
  recipientName,
  memoryPreview,
  onNext,
  onBack,
  active = true,
  letterRolling = false,
}) {
  const [written, setWritten] = useState(false);
  const { play } = useAudio();

  useEffect(() => {
    if (!active) {
      setWritten(false);
    }
  }, [active]);
  const segments = useMemo(
    () => sisterLetter({ senderName, recipientName }),
    [senderName, recipientName],
  );

  const mediaRenderers = {
    rakhi: () => <Rakhi size={110} />,
    memory: () =>
      memoryPreview ? (
        <img
          src={memoryPreview}
          alt="A memory"
          className="mx-auto max-h-56 rounded-[3px] border border-gold/40 shadow-paper"
        />
      ) : null,
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      hideNext
      scrollable
      className="box-border min-h-0 justify-start"
    >
      {/* =====================================================
          GUIDE CHARACTER IN THE LETTER FLOW
      ===================================================== */}
      <div className="relative z-20 mb-3 shrink-0 pointer-events-none">
        <GuideCharacter size={72} mood={written ? "excited" : "happy"} />
      </div>

      {/* =====================================================
          AMBIENT DIYAS BACKGROUND DEPTH
      ===================================================== */}
      <div className="absolute inset-0 z-0">
        <DiyaLayer count={5} />
      </div>

      {/* =====================================================
          MAIN PRINTING TYPEWRITER CONTENT
      ===================================================== */}
      <div className="relative z-10 flex flex-col items-center pt-8 md:pt-12 w-full">
        <LetterPaper rolling={letterRolling}>
          <LetterWritingEngine
            segments={segments}
            mediaRenderers={mediaRenderers}
            active={active && !letterRolling}
            autoScroll
            onComplete={() => active && setWritten(true)}
          />
        </LetterPaper>

        {/* =====================================================
            UNIFIED BOTTOM ACTION CONTROLS (Back Next to Next)
        ===================================================== */}
        <div className="mt-8 flex items-center justify-center gap-4 w-full max-w-md pb-6">
          <button
            type="button"
            onClick={() => {
              if (letterRolling) return;
              play("paper");
              onBack();
            }}
            className="px-6 py-2.5 font-body text-sm text-wine/70 hover:text-wine transition-colors focus-ring disabled:opacity-40"
            disabled={letterRolling}
          >
            Back
          </button>

          {written && (
            <button
              type="button"
              onClick={() => {
                if (letterRolling) return;
                play("bell");
                setWritten(false);
                onNext();
              }}
              className="rounded-[3px] bg-wine px-8 py-2.5 font-body text-white shadow-paper hover:bg-wine-dark transition-all disabled:opacity-40"
              disabled={letterRolling}
            >
              Send the letter
            </button>
          )}
        </div>
      </div>
    </StepShell>
  );
}
