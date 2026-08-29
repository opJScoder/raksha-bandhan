import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import NamesStep from "../scenes/NamesStep.jsx";
import GiftStep from "../scenes/BrotherFlow/GiftStep.jsx";
import RakhiStep from "../scenes/SisterFlow/RakhiStep.jsx";
import MemoryStep from "../scenes/MemoryStep.jsx";
import LetterStepBrother from "../scenes/BrotherFlow/LetterStep.jsx";
import LetterStepSister from "../scenes/SisterFlow/LetterStep.jsx";
// import LetterSealingSequence from "../components/letter/LetterSealingSequence.jsx";
import Envelope from "../components/envelope/Envelope.jsx";
import ShareScene from "../scenes/ShareScene.jsx";

// Load native backend collection methods matching your configuration tracks
import { uploadImage, createGift } from "../lib/api.js";
import { useAudio } from "../components/audio/AudioManager.jsx";

export default function CreatePage({
  embedded = false,
  role: propRole,
  onBackToHome,
}) {
  const { role: routeRole } = useParams();
  const currentRole = (
    embedded ? propRole || "" : routeRole || ""
  ).toLowerCase();
  const navigate = useNavigate();
  const { play } = useAudio();

  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [letterRolling, setLetterRolling] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    siblingName: "",
    gift: { amount: "", photoPreview: null, photoFile: null },
    memoryPreview: null,
    memoryFile: null,
  });

  const isSister = currentRole === "sister";

  const handleUpdateGift = (updatedGift) => {
    setFormData((prev) => ({ ...prev, gift: updatedGift }));
  };

  const handleUpdateMemory = (fileObject, base64String) => {
    setFormData((prev) => ({
      ...prev,
      memoryFile: fileObject,
      memoryPreview: base64String,
    }));
  };

  const handleNamesSubmit = (namesPayload) => {
    setFormData((prev) => ({
      ...prev,
      userName: namesPayload.userName,
      siblingName: namesPayload.siblingName,
    }));
    setStep(2);
  };

  // Fixed the infinite rendering loop by locking it behind a state gate
  const handleLetterComplete = async () => {
    if (isSubmitting) return; // Block duplicate double-clicks instantly
    setIsSubmitting(true);

    try {
      let giftImageUrl = null;
      let memoryImageUrl = null;

      // 1. Process local image attachments up into cloud storage nodes
      if (formData.gift.photoFile) {
        const up = await uploadImage(formData.gift.photoFile);
        giftImageUrl = up.url;
      }
      if (formData.memoryFile) {
        const up = await uploadImage(formData.memoryFile);
        memoryImageUrl = up.url;
      }

      // 2. Format names keys precisely to clear out structural API errors
      const payload = {
        role: currentRole,
        senderName: formData.userName,
        recipientName: formData.siblingName,
        giftType:
          currentRole === "brother"
            ? giftImageUrl
              ? "photo"
              : formData.gift.amount
                ? "amount"
                : null
            : "rakhi",
        giftAmount:
          currentRole === "brother" && formData.gift.amount
            ? Number(formData.gift.amount)
            : null,
        giftImageUrl,
        memoryImageUrl,
        parentSlug:
          new URLSearchParams(window.location.search).get("replyTo") || null,
      };

      // 3. Register entity inside your active backend cluster tracking sheets
      const created = await createGift(payload);

      // 4. Generate beautiful, valid sharing route addresses mapping directly onto your router paths
      setShareUrl(`${window.location.origin}/gift/${created.slug}`);

      return created;
    } catch (err) {
      console.error("API Processing Error:", err);
      alert("The envelope slipped on its way out. Let's try sending again!");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLetterSend = async () => {
    play("paper");
    setLetterRolling(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setStep(5);
    void handleLetterComplete();
  };

  const handleStepForward = () => {
    setIsTransitioning(true);
    window.setTimeout(() => {
      setStep((prev) => prev + 1);
      setIsTransitioning(false);
    }, 1200);
  };

  const handleStepBackward = () => {
    play("paper");
    if (step === 1) {
      setIsTransitioning(true);
      setIsGoingBack(true);
      window.setTimeout(() => {
        setIsGoingBack(false);
        play("whoosh");
        if (embedded && onBackToHome) {
          onBackToHome();
        } else {
          navigate("/");
        }
      }, 1200);
    } else {
      setIsTransitioning(true);
      window.setTimeout(() => {
        setStep((prev) => prev - 1);
        setIsTransitioning(false);
      }, 1200);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full bg-ivory overflow-x-hidden">
      {/* =====================================================
          HORIZONTAL PAN ANIMATION
      ===================================================== */}
      <motion.div
        className="relative z-10 flex h-[100dvh] w-[600vw] bg-transparent"
        initial={{ x: "100vw" }}
        animate={{ x: isGoingBack ? "100vw" : `${-(step - 1) * 100}vw` }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* STEP 1: NAMES */}
        <div className="relative h-[100dvh] w-[100vw] shrink-0 bg-transparent">
          <NamesStep onNext={handleNamesSubmit} onBack={handleStepBackward} />
        </div>

        {/* STEP 2: GIFT/RAKHI */}
        <div className="relative h-[100dvh] w-[100vw] shrink-0 bg-transparent">
          {isSister ? (
            <RakhiStep
              onNext={handleStepForward}
              onBack={handleStepBackward}
              active={step === 2}
            />
          ) : (
            <GiftStep
              gift={formData.gift}
              onChange={handleUpdateGift}
              onNext={handleStepForward}
              onBack={handleStepBackward}
            />
          )}
        </div>

        {/* STEP 3: MEMORY */}
        <div className="relative h-[100dvh] w-[100vw] shrink-0 bg-transparent">
          <MemoryStep
            memoryPreview={formData.memoryPreview}
            onChange={handleUpdateMemory}
            onNext={handleStepForward}
            onBack={handleStepBackward}
          />
        </div>

        {/* STEP 4: LETTER */}
        <div className="relative h-[100dvh] w-[100vw] shrink-0 bg-transparent">
          {isSister ? (
            <LetterStepSister
              senderName={formData.userName}
              recipientName={formData.siblingName}
              memoryPreview={formData.memoryPreview}
              onNext={handleLetterSend}
              onBack={handleStepBackward}
              isSubmitting={isSubmitting}
              active={step === 4}
              letterRolling={letterRolling}
            />
          ) : (
            <LetterStepBrother
              senderName={formData.userName}
              recipientName={formData.siblingName}
              gift={formData.gift}
              memoryPreview={formData.memoryPreview}
              onNext={handleLetterSend}
              onBack={handleStepBackward}
              isSubmitting={isSubmitting}
              active={step === 4}
              letterRolling={letterRolling}
            />
          )}
        </div>

        {/* STEP 5: ENVELOPE */}
        <div className="relative h-[100dvh] w-[100vw] shrink-0 bg-transparent">
          <Envelope
            senderName={formData.userName}
            recipientName={formData.siblingName}
            wish=""
            active={step === 5}
            onBack={() => setStep(4)}
            onSend={() => setStep(6)}
          />
        </div>

        {/* STEP 6: SHARE */}
        <div className="relative h-[100dvh] w-[100vw] shrink-0 bg-transparent">
          <ShareScene role={currentRole} url={shareUrl} />
        </div>
      </motion.div>
    </div>
  );
}
