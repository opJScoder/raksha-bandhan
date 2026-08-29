import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAudio } from "../audio/AudioManager.jsx";

const MAX_MB = 8;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/heic"];

export default function GiftPicker({ gift, onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const { play } = useAudio();
  const inputRef = useRef(null);

  const handleFile = (file) => {
    setError("");
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Please choose a JPG, PNG, WEBP, or HEIC photo.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(
        `That photo is a little large — please keep it under ${MAX_MB}MB.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // Maintained existing amount text state values safely via object spreading
      onChange({
        ...gift,
        type: "photo_and_amount",
        photoFile: file,
        photoPreview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  // Only clear the file parameters, leaving the amount box completely intact
  const clearPhoto = () => {
    play("paper");
    onChange({
      ...gift,
      photoFile: null,
      photoPreview: null,
    });
  };

  return (
    <div className="w-full max-w-sm pt-6 md:pt-10">
      <p className="mb-3 font-display text-2xl text-wine">
        What are you gifting your sister?
      </p>

      {!gift.photoPreview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`focus-ring flex cursor-pointer flex-col items-center justify-center rounded-[3px] border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragOver
              ? "border-saffron bg-saffron/5"
              : "border-gold/50 bg-ivory-dim"
          }`}
        >
          <p className="font-display text-lg text-wine">
            A little surprise for her
          </p>
          <p className="mt-1 font-body text-sm text-ink/60">
            Drop a photo here, or tap to choose one from your phone
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[3px] border border-gold/40 shadow-paper"
        >
          <img
            src={gift.photoPreview}
            alt="Gift preview"
            className="h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={clearPhoto}
            className="focus-ring absolute right-2 top-2 rounded-full bg-ink/70 px-3 py-1 font-body text-xs text-ivory hover:bg-ink"
          >
            Remove
          </button>
        </motion.div>
      )}

      {error && <p className="mt-2 font-body text-sm text-wine">{error}</p>}

      {/* Changed divider text label style decoration spacing layout slightly to feel cohesive */}
      <div className="my-5 flex items-center gap-3 text-ink/40">
        <span className="h-px flex-1 bg-ink/15" />
        <span className="font-display text-sm">and / or</span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <label className="block">
        {/* Removed "instead" keyword from description to make multi-select clear to users */}
        <span className="mb-2 block font-display text-lg text-wine">
          Enter a gift token amount
        </span>
        <div className="flex items-center rounded-[2px] border-b-2 border-gold/50 focus-within:border-wine">
          <span className="pr-1 font-body text-lg text-ink/60">₹</span>
          <input
            type="number"
            min="0"
            inputMode="decimal"
            value={gift.amount || ""}
            // Safely preserves photo files when the user edits token input parameters
            onChange={(e) =>
              onChange({
                ...gift,
                amount: e.target.value,
              })
            }
            placeholder="1100"
            className="w-full bg-transparent py-2 font-body text-lg text-ink placeholder:text-ink/30 focus:outline-none"
          />
        </div>
      </label>
    </div>
  );
}
