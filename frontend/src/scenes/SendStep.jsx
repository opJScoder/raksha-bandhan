import { useEffect, useRef, useState } from "react";
import Envelope from "../components/envelope/Envelope.jsx";
import Button from "../components/ui/Button.jsx";
import { useAudio } from "../components/audio/AudioManager.jsx";
import { uploadImage, createGift } from "../lib/api.js";

const wishFor = (role) =>
  role === "brother"
    ? "A rakhi, and a lifetime of ribbing."
    : "A gift, and a lifetime of gratitude.";

export default function SendStep({ state, onDone }) {
  const [envelopeFinished, setEnvelopeFinished] = useState(false);
  const [apiState, setApiState] = useState("pending"); // pending | success | error
  const [result, setResult] = useState(null);
  const { play } = useAudio();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        let giftImageUrl = null;
        let memoryImageUrl = null;

        if (state.gift.photoFile) {
          const up = await uploadImage(state.gift.photoFile);
          giftImageUrl = up.url;
        }
        if (state.memoryFile) {
          const up = await uploadImage(state.memoryFile);
          memoryImageUrl = up.url;
        }

        const payload = {
          role: state.role,
          senderName: state.senderName,
          recipientName: state.recipientName,
          giftType:
            state.role === "brother"
              ? state.gift.type
              : state.rakhiSent
                ? "rakhi"
                : null,
          giftAmount:
            state.role === "brother" && state.gift.type === "amount"
              ? Number(state.gift.amount)
              : null,
          giftImageUrl,
          memoryImageUrl,
          parentSlug: state.parentSlug || null,
        };

        const created = await createGift(payload);
        setResult(created);
        setApiState("success");
      } catch (err) {
        console.error(err);
        setApiState("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (envelopeFinished && apiState === "success") {
      onDone(result);
    }
  }, [envelopeFinished, apiState, result, onDone]);

  if (apiState === "error") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-ivory px-6 text-center">
        <p className="font-display text-2xl text-wine">
          The envelope slipped on its way out.
        </p>
        <p className="max-w-sm font-body text-ink/60">
          Something interrupted the send — check your connection and let's try
          again.
        </p>
        <Button
          onClick={() => {
            play("bell");
            window.location.reload();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-ivory px-6">
      <Envelope
        senderName={state.senderName}
        recipientName={state.recipientName}
        wish={wishFor(state.role)}
        onComplete={() => setEnvelopeFinished(true)}
      />
      {envelopeFinished && apiState === "pending" && (
        <p className="mt-6 font-body text-sm text-ink/50">
          Sealing the details…
        </p>
      )}
    </div>
  );
}
