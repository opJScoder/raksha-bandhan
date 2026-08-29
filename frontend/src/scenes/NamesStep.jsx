import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import DiyaLayer from "../components/decor/DiyaLayer.jsx";
import GuideCharacter from "../components/guide/GuideCharacter.jsx";
import { useAudio } from "../components/audio/AudioManager.jsx";

// Accept navigation or state callbacks from your parent manager layout context container
export default function NamesStep({ onNext, onBack }) {
  const { role } = useParams();
  const currentRole = (role || "").toLowerCase();
  const { play } = useAudio();

  const [userName, setUserName] = useState("");
  const [siblingName, setSiblingName] = useState("");

  const isSister = currentRole === "sister";

  const config = {
    userLabel: isSister ? "Your pretty name?" : "Your good name?",
    userPlaceholder: isSister ? "e.g. Priya" : "e.g. Rahul",

    siblingLabel: isSister
      ? "Your brother's good name?"
      : "Your sister's pretty name?",
    siblingPlaceholder: isSister ? "e.g. Rahul" : "e.g. Priya",
  };

  const uTrimmed = userName.trim();
  const sTrimmed = siblingName.trim();
  const alphaRegex = /^[A-Za-z\s]+$/;

  const isUserInvalid =
    uTrimmed.length > 0 &&
    (uTrimmed.length < 2 || uTrimmed.length > 30 || !alphaRegex.test(uTrimmed));
  const isSiblingInvalid =
    sTrimmed.length > 0 &&
    (sTrimmed.length < 2 || sTrimmed.length > 30 || !alphaRegex.test(sTrimmed));

  const isFormValid =
    uTrimmed.length >= 2 &&
    uTrimmed.length <= 30 &&
    alphaRegex.test(uTrimmed) &&
    sTrimmed.length >= 2 &&
    sTrimmed.length <= 30 &&
    alphaRegex.test(sTrimmed);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-transparent px-6 pb-10 pt-[140px] md:pt-[180px]"
    >
      <div className="pointer-events-none absolute left-1/2 top-[15%] -translate-x-1/2 z-20">
        <GuideCharacter size={72} mood={isFormValid ? "excited" : "happy"} />
      </div>

      <div className="absolute inset-0 z-0">
        <DiyaLayer count={5} />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        {/* User Field */}
        <div className="flex flex-col gap-1.5">
          <label className="font-display text-xl text-wine text-left">
            {config.userLabel}
          </label>
          <input
            type="text"
            maxLength={30}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={config.userPlaceholder}
            className={`w-full rounded-[3px] border bg-ivory-dim px-4 py-3 font-body text-ink placeholder:text-ink/30 focus:outline-none shadow-sm ${
              isUserInvalid
                ? "border-rose text-rose"
                : "border-gold/40 focus:border-gold"
            }`}
          />
        </div>

        {/* Sibling Field */}
        <div className="flex flex-col gap-1.5">
          <label className="font-display text-xl text-wine text-left">
            {config.siblingLabel}
          </label>
          <input
            type="text"
            maxLength={30}
            value={siblingName}
            onChange={(e) => setSiblingName(e.target.value)}
            placeholder={config.siblingPlaceholder}
            className={`w-full rounded-[3px] border bg-ivory-dim px-4 py-3 font-body text-ink placeholder:text-ink/30 focus:outline-none shadow-sm ${
              isSiblingInvalid
                ? "border-rose text-rose"
                : "border-gold/40 focus:border-gold"
            }`}
          />
        </div>

        {/* Action Controls */}
        <div className="mt-4 flex justify-center items-center gap-3">
          <button
            type="button"
            onClick={() => {
              play("paper");
              onBack();
            }} // Triggers parent step layout slide backward logic
            className="px-5 py-2.5 font-body text-sm text-wine/70 hover:text-wine transition-colors"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!isFormValid}
            onClick={() => {
              if (isFormValid && onNext) {
                play("chime");
                // Pass collected layout variables upwards safely to your state engine instead of broken url mutations
                onNext({ userName: uTrimmed, siblingName: sTrimmed });
              }
            }}
            className="rounded-[3px] bg-wine px-8 py-2.5 font-body text-white shadow-paper hover:bg-wine-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
