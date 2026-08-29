import StepShell from "../../components/ui/StepShell.jsx";
import GiftPicker from "../../components/gift/GiftPicker.jsx";
import DiyaLayer from "../../components/decor/DiyaLayer.jsx";
import GuideCharacter from "../../components/guide/GuideCharacter.jsx";
import { useAudio } from "../../components/audio/AudioManager.jsx";
import { isValidAmount } from "../../lib/sanitize.js";

export default function GiftStep({ gift, onChange, onNext, onBack }) {
  const hasPhoto = Boolean(gift.photoPreview);
  const hasAmount = Boolean(gift.amount && gift.amount.trim() !== "");
  const amountOk = hasAmount ? isValidAmount(gift.amount) : true;
  const canProceed = (hasPhoto || hasAmount) && amountOk;
  const { play } = useAudio();

  return (
    <StepShell onNext={onNext} onBack={onBack} hideNext>
      {/* =====================================================
          TOP FIXED GUIDE CHARACTER (Perfectly identical layout)
      ===================================================== */}
      <div className="pointer-events-none absolute left-1/2 top-4 md:top-6 -translate-x-1/2 z-20">
        <GuideCharacter size={72} mood={canProceed ? "excited" : "happy"} />
      </div>

      <div className="absolute inset-0 z-0">
        <DiyaLayer count={5} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <GiftPicker gift={gift} onChange={onChange} />

        {gift.amount && !isValidAmount(gift.amount) && (
          <p className="mt-2 max-w-sm font-body text-sm text-rose text-center">
            Please enter a valid amount.
          </p>
        )}

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
            disabled={!canProceed}
            onClick={() => {
              play("chime");
              onNext();
            }}
            className="rounded-[3px] bg-wine px-8 py-2.5 font-body text-white shadow-paper hover:bg-wine-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </StepShell>
  );
}
