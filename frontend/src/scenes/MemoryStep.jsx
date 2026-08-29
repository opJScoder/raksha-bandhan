import StepShell from "../components/ui/StepShell.jsx";
import MemoryUpload from "../components/memory/MemoryUpload.jsx";
import DiyaLayer from "../components/decor/DiyaLayer.jsx";
import GuideCharacter from "../components/guide/GuideCharacter.jsx";
import { useAudio } from "../components/audio/AudioManager.jsx";

export default function MemoryStep({
  memoryPreview,
  onChange,
  onNext,
  onBack,
}) {
  // The step is interactive either way, so we maintain a clean happy active state
  const hasMemory = Boolean(memoryPreview);
  const { play } = useAudio();

  return (
    // hideNext is passed to prevent the duplicate absolute button from StepShell appearing
    <StepShell onNext={onNext} onBack={onBack} hideNext>
      {/* =====================================================
          TOP FIXED GUIDE CHARACTER (Perfectly matching positions)
      ===================================================== */}
      <div className="pointer-events-none absolute left-1/2 top-4 md:top-6 -translate-x-1/2 z-20">
        <GuideCharacter size={72} mood={hasMemory ? "excited" : "happy"} />
      </div>

      {/* =====================================================
          AMBIENT DIYAS LAYER
      ===================================================== */}
      <div className="absolute inset-0 z-0">
        <DiyaLayer count={5} />
      </div>

      {/* =====================================================
          MEMORY UPLOAD WORKSPACE RENDERER
      ===================================================== */}
      <div className="relative z-10 flex flex-col items-center pt-6 md:pt-10">
        {/* Fed memoryPreview parameter cleanly down into your lower upload handler */}
        <MemoryUpload
          preview={memoryPreview}
          onChange={(fileObject, base64String) =>
            onChange(fileObject, base64String)
          }
        />
        {/* =====================================================
            UNIFIED BOTTOM ACTION CONTROLS (Back Next to Next)
        ===================================================== */}
        <div className="mt-8 flex items-center justify-center gap-4 w-full max-w-sm">
          <button
            type="button"
            onClick={() => {
              play("paper");
              onBack();
            }}
            className="px-6 py-2.5 font-body text-sm text-wine/70 hover:text-wine transition-colors focus-ring"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              play("chime");
              onNext();
            }}
            className="rounded-[3px] bg-wine px-8 py-2.5 font-body text-white shadow-paper hover:bg-wine-dark transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </StepShell>
  );
}
