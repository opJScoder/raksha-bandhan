import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useAudio } from "../audio/AudioManager.jsx";
import DiyaLayer from "../decor/DiyaLayer.jsx";
import GuideCharacter from "../guide/GuideCharacter.jsx";

const foldStages = [
  "open",
  "top",
  "right",
  "bottom",
  "left",
  "stamp",
  "flip",
  "write",
  "complete",
];




function EnvelopePanel({ side, stage }) {
  const closed = foldStages.indexOf(stage) >= foldStages.indexOf(side);
  const positions = {
    top: {
      position: { left: "18%", top: "-42%", width: "64%", height: "64%" },
      clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
      origin: "50% 100%",
      openRotation: { rotateX: 0 },
      closedRotation: { rotateX: 180 },
    },
    right: {
      position: { left: "82%", top: "18%", width: "32%", height: "64%" },
      clipPath: "polygon(0 0, 100% 50%, 0 100%)",
      origin: "0% 50%",
      openRotation: { rotateY: 0 },
      closedRotation: { rotateY: -180 },
    },
    bottom: {
      position: { left: "18%", top: "78%", width: "64%", height: "64%" },
      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
      origin: "50% 0%",
      openRotation: { rotateX: 0 },
      closedRotation: { rotateX: -180 },
    },
    left: {
      position: { left: "-14%", top: "18%", width: "32%", height: "64%" },
      clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
      origin: "100% 50%",
      openRotation: { rotateY: 0 },
      closedRotation: { rotateY: 180 },
    },
  }[side];

  return (
    <motion.div
      initial={positions.openRotation}
      animate={closed ? positions.closedRotation : positions.openRotation}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="absolute z-10 border border-gold/50 shadow-[0_8px_16px_rgba(70,24,35,0.2)]"
      style={{
        ...positions.position,
        clipPath: positions.clipPath,
        transformOrigin: positions.origin,
        transformStyle: "preserve-3d",
        background: "linear-gradient(145deg, #7c2046, #6e1737)",
        borderColor: "rgba(212, 168, 79, 0.42)",
      }}
    />
  );
}

function AddressSide({ senderName, recipientName, stage }) {
  const writing = stage === "write" || stage === "complete";
  const stampVisible = foldStages.indexOf(stage) >= foldStages.indexOf("stamp");

  return (
    <div className="absolute left-[18%] top-[18%] h-[64%] w-[64%] overflow-hidden rounded-[10px] border border-gold/50 bg-wine-dark p-5 text-left shadow-2xl">
      <div className="pointer-events-none absolute inset-2 rounded-[6px] border border-gold/15" />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        animate={{
          opacity: stampVisible ? 1 : 0,
          scale: stampVisible ? 1 : 0.7,
          rotate: 0,
        }}
        transition={{ duration: 0.55 }}
        className="absolute right-4 top-4 rounded-[3px] border border-gold/40 bg-wine-light/60 px-3 py-2 text-center"
      >
        <div className="font-display text-[8px] uppercase tracking-[0.32em] text-gold-light">
          Rakhi
        </div>
        <div className="font-display text-[7px] uppercase tracking-[0.25em] text-gold-light/80">
          Post
        </div>
      </motion.div>

      <div className="absolute bottom-6 left-6 flex flex-col gap-4">
        <div>
          <div className="font-display text-[9px] uppercase tracking-[0.28em] text-gold/55">
            To:
          </div>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={
              writing ? { width: "auto", opacity: 1 } : { width: 0, opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className="overflow-hidden whitespace-nowrap font-hand text-2xl text-ivory"
          >
            {recipientName || "Dear Sibling"}
          </motion.div>
        </div>
        <div>
          <div className="font-display text-[9px] uppercase tracking-[0.28em] text-gold/55">
            From:
          </div>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={
              writing ? { width: "auto", opacity: 1 } : { width: 0, opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.9 }}
            className="overflow-hidden whitespace-nowrap font-hand text-xl text-gold-light"
          >
            {senderName || "Your Name"}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {stage === "write" && (
          <motion.div
            initial={{ opacity: 0, x: -12, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [-12, 4, 25, 38],
              y: [20, 5, 28, 38],
            }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="pointer-events-none absolute left-[24%] top-[48%] text-gold-light"
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="-rotate-45"
            >
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Envelope({
  senderName,
  recipientName,
  active = false,
  onBack,
  onSend,
}) {
  const [stage, setStage] = useState("open");
  const { play } = useAudio();

//   to remove
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    setStage("open");
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const timers = [
      setTimeout(() => {
        setStage("top");
        play("paper");
      }, 900),
      setTimeout(() => {
        setStage("right");
        play("paper");
      }, 2100),
      setTimeout(() => {
        setStage("bottom");
        play("paper");
      }, 3300),
      setTimeout(() => {
        setStage("left");
        play("paper");
      }, 4500),
      setTimeout(() => {
        setStage("stamp");
        play("bell");
      }, 5700),
      setTimeout(() => {
        setStage("flip");
        play("paper");
      }, 6900),
      setTimeout(() => setStage("write"), 8200),
      setTimeout(() => setStage("complete"), 11200),
    ];

    return () => {
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [active]);


  const handleReplay = () => {
    setReplayKey((key) => key + 1);
  };


  const isFlipped =
    stage === "flip" || stage === "write" || stage === "complete";

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-transparent px-6 py-6 select-none">
      <div className="pointer-events-none absolute left-1/2 top-4 z-50 -translate-x-1/2 md:top-6">
        <GuideCharacter
          size={72}
          mood={stage === "complete" ? "excited" : "happy"}
        />
      </div>
      <div className="absolute inset-0 z-0">
        <DiyaLayer count={5} />
      </div>

      <div className="relative z-10 flex h-[520px] w-full max-w-[560px] items-center justify-center [perspective:1400px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-none"
          style={{
            width: "min(86vw, 560px)",
            height: "380px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="absolute left-[18%] top-[18%] h-[64%] w-[64%] rounded-[10px] border border-gold/40 bg-wine shadow-2xl" />
            <EnvelopePanel side="top" stage={stage} />
            <EnvelopePanel side="right" stage={stage} />
            <EnvelopePanel side="bottom" stage={stage} />
            <EnvelopePanel side="left" stage={stage} />
            <div className="absolute left-[25%] top-[28%] z-20 h-[44%] w-[50%] rounded-[3px] border border-gold/30 bg-ivory p-3 shadow-[0_14px_25px_rgba(54,21,30,0.2)]">
              <div className="absolute inset-2 rounded-[2px] border border-gold/10" />
              <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-ink/10" />
            </div>
          </div>

          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(180deg)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <AddressSide
              senderName={senderName}
              recipientName={recipientName}
              stage={stage}
            />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {stage === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 z-20 flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => {
                play("paper");
                onBack();
              }}
              className="px-5 py-2.5 font-body text-sm text-wine/70 hover:text-wine"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleReplay}
              className="px-5 py-2.5 font-body text-sm text-wine/70 hover:text-wine"
            >
              Replay
            </button>
            <button
              type="button"
              onClick={() => {
                play("chime");
                onSend();
              }}
              className="rounded-[3px] bg-wine px-8 py-2.5 font-body text-sm text-white shadow-paper hover:bg-wine-dark"
            >
              Send
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
