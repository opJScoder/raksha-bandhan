import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { fetchGift } from "../lib/api.js";
import { brotherLetter, sisterLetter } from "../lib/letterContent.js";
import GuideCharacter from "../components/guide/GuideCharacter.jsx";
import DiyaLayer from "../components/decor/DiyaLayer.jsx";
import LetterPaper from "../components/letter/LetterPaper.jsx";
import LetterWritingEngine from "../components/letter/LetterWritingEngine.jsx";
import Rakhi from "../components/rakhi/Rakhi.jsx";
import Button from "../components/ui/Button.jsx";
import { useAudio } from "../components/audio/AudioManager.jsx";

export default function ReceiveScene() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { play, ensureStarted } = useAudio();
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error
  const [gift, setGift] = useState(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchGift(slug)
      .then((data) => {
        if (!cancelled) {
          setGift(data);
          setStatus("ready");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(err.status === 404 ? "notfound" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <FestiveMessage
        title="Bringing your letter…"
        subtitle="Just a moment while the seal comes undone."
      />
    );
  }
  if (status === "notfound") {
    return (
      <FestiveMessage
        title="This letter couldn't be found."
        subtitle="The link may be incomplete, or the letter may have been sent elsewhere."
      >
        <Button
          variant="ghost"
          onClick={() => {
            play("paper");
            navigate("/");
          }}
        >
          Home
        </Button>
      </FestiveMessage>
    );
  }
  if (status === "error") {
    return (
      <FestiveMessage
        title="Something interrupted the delivery."
        subtitle="Please check your connection and try again."
      >
        <Button
          onClick={() => {
            play("bell");
            window.location.reload();
          }}
        >
          Try again
        </Button>
      </FestiveMessage>
    );
  }

  const segments =
    gift.role === "brother"
      ? brotherLetter({
          senderName: gift.senderName,
          recipientName: gift.recipientName,
          gift: { amount: gift.giftAmount, photoPreview: gift.giftImageUrl },
        })
      : sisterLetter({
          senderName: gift.senderName,
          recipientName: gift.recipientName,
        });

  const mediaRenderers = {
    gift: () =>
      gift.giftImageUrl ? (
        <img
          src={gift.giftImageUrl}
          alt="Gift"
          className="mx-auto max-h-56 rounded-[3px] border border-gold/40 shadow-paper"
        />
      ) : (
        <span className="mx-auto block w-fit rounded-[3px] border border-gold/40 bg-gold/10 px-6 py-3 font-display text-2xl text-wine">
          ₹{Number(gift.giftAmount || 0).toLocaleString("en-IN")}
        </span>
      ),
    rakhi: () => <Rakhi size={110} />,
    memory: () =>
      gift.memoryImageUrl ? (
        <img
          src={gift.memoryImageUrl}
          alt="A memory"
          className="mx-auto max-h-56 rounded-[3px] border border-gold/40 shadow-paper"
        />
      ) : null,
  };

  const ctaText =
    gift.role === "brother"
      ? "Want to send a rakhi to your strong brother?"
      : "Want to send a gift to your pretty sister?";
  const replyRole = gift.role === "brother" ? "sister" : "brother";

  return (
    <div className="relative flex h-[100dvh] w-full overflow-hidden bg-ivory">
      <DiyaLayer count={5} />
      <div className="relative z-10 flex h-full w-full flex-col items-center overflow-y-auto px-6 py-14">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.button
              key="closed"
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => {
                ensureStarted();
                play("bell");
                setOpened(true);
              }}
              className="focus-ring flex flex-col items-center gap-4"
            >
              <div className="relative h-40 w-56 rounded-[10px] border border-gold/50 bg-wine shadow-2xl">
                <svg
                  className="absolute -top-1 left-0 h-16 w-full text-wine-light"
                  viewBox="0 0 224 64"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 0 L112 56 L224 0 Z"
                    fill="currentColor"
                    stroke="#D4A84F"
                    strokeWidth="1"
                  />
                </svg>
                <div className="absolute left-1/2 top-10 h-8 w-8 -translate-x-1/2 rounded-full bg-gold shadow-glow ring-2 ring-gold-light/70" />
              </div>
              <p className="font-display text-xl text-wine">
                A letter has arrived — tap to open
              </p>
            </motion.button>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="mb-6 flex justify-center">
                <GuideCharacter size={48} mood="excited" />
              </div>
              <LetterPaper>
                <LetterWritingEngine
                  segments={segments}
                  mediaRenderers={mediaRenderers}
                  speedMs={40}
                  autoScroll
                />
              </LetterPaper>

              <div className="mt-10 flex flex-col items-center gap-3 text-center">
                <p className="max-w-sm font-display text-2xl text-wine">
                  {ctaText}
                </p>
                <Button
                  onClick={() => {
                    play("chime");
                    navigate(`/create/${replyRole}?replyTo=${gift.slug}`);
                  }}
                >
                  Write back
                </Button>
                <button
                  onClick={() => {
                    play("paper");
                    navigate("/");
                  }}
                  className="focus-ring mt-2 font-body text-sm text-ink/50 underline underline-offset-2"
                >
                  Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FestiveMessage({ title, subtitle, children }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-ivory px-6 text-center">
      <GuideCharacter size={48} />
      <p className="font-display text-2xl text-wine">{title}</p>
      {subtitle && <p className="max-w-sm font-body text-ink/60">{subtitle}</p>}
      {children}
    </div>
  );
}
