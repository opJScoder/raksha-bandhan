import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../audio/AudioManager.jsx";
import PenIcon from "./PenIcon.jsx";

// Turns segments (see lib/letterContent.js) into a flat token stream:
// words (revealed one at a time) and media markers (revealed as a beat).
function tokenize(segments) {
  const tokens = [];
  segments.forEach((seg) => {
    if (seg.type === "text") {
      const parts = seg.value.split(/(\n)/); // keep newlines as their own tokens
      parts.forEach((part) => {
        if (part === "") return;
        if (part === "\n") {
          tokens.push({ type: "break" });
        } else {
          part.split(" ").forEach((w, i, arr) => {
            if (w === "") return;
            tokens.push({
              type: "word",
              text: w + (i < arr.length - 1 ? " " : ""),
            });
          });
        }
      });
    } else {
      tokens.push({ type: "media", kind: seg.type });
    }
  });
  return tokens;
}

export default function LetterWritingEngine({
  segments,
  mediaRenderers,
  speedMs = 55,
  onComplete,
  active = true,
  autoScroll = false,
}) {
  const tokens = useMemo(() => tokenize(segments), [segments]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);
  const [penPos, setPenPos] = useState({ x: 0, y: 0, visible: false });
  const containerRef = useRef(null);
  const lastWordRef = useRef(null);
  const previousActiveRef = useRef(active);
  const autoFollowPausedRef = useRef(false);
  const { play } = useAudio();
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setPenPos((p) => ({ ...p, visible: false }));
      previousActiveRef.current = false;
      return;
    }
    if (!previousActiveRef.current) {
      setVisibleCount(0);
      setDone(false);
      setPenPos({ x: 0, y: 0, visible: false });
      const scrollContainer = containerRef.current?.closest(".overflow-y-auto");
      if (scrollContainer) {
        autoFollowPausedRef.current = false;
        scrollContainer.scrollTop = 0;
      }
    }
    previousActiveRef.current = true;
    if (done) return;
    if (visibleCount >= tokens.length) {
      setDone(true);
      setPenPos((p) => ({ ...p, visible: false }));
      onComplete?.();
      return;
    }
    const current = tokens[visibleCount];
    const delay = current?.type === "media" ? 900 : speedMs;
    const t = setTimeout(() => {
      setVisibleCount((c) => c + 1);
      if (current?.type === "word" && Math.random() > 0.6) play("pen");
    }, delay);
    return () => clearTimeout(t);
  }, [visibleCount, tokens, done, speedMs, onComplete, play, active]);

  useLayoutEffect(() => {
    if (!containerRef.current || !lastWordRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const wordRect = lastWordRef.current.getBoundingClientRect();
    setPenPos({
      x: wordRect.right - containerRect.left + 25,
      y: wordRect.top - containerRect.top + 12,
      visible: !done,
    });

    if (autoScroll && active && !done && !autoFollowPausedRef.current) {
      const scrollContainer = containerRef.current?.closest(".overflow-y-auto");
      if (!scrollContainer) return;

      const scrollRect = scrollContainer.getBoundingClientRect();
      const padding = 96;
      const distanceBelow = wordRect.bottom - (scrollRect.bottom - padding);

      if (distanceBelow > 0) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollTop + distanceBelow,
          behavior: "smooth",
        });
      }
    }
  }, [visibleCount, done, autoScroll, active]);

  useEffect(() => {
    if (!autoScroll || !active) return undefined;
    const scrollContainer = containerRef.current?.closest(".overflow-y-auto");
    if (!scrollContainer) return undefined;

    const pauseAtReaderPosition = (event) => {
      if (event.type === "wheel" && event.deltaY < 0) {
        autoFollowPausedRef.current = true;
        return;
      }
      if (event.type === "touchmove") {
        autoFollowPausedRef.current = true;
        return;
      }
      const isAtBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 24;
      autoFollowPausedRef.current = !isAtBottom;
    };

    scrollContainer.addEventListener("wheel", pauseAtReaderPosition, {
      passive: true,
    });
    scrollContainer.addEventListener("touchmove", pauseAtReaderPosition, {
      passive: true,
    });

    return () => {
      scrollContainer.removeEventListener("wheel", pauseAtReaderPosition);
      scrollContainer.removeEventListener("touchmove", pauseAtReaderPosition);
    };
  }, [autoScroll, active]);

  const skip = () => {
    setVisibleCount(tokens.length);
  };

  let wordCursor = -1;

  return (
    <div ref={containerRef} className="relative">
      <div className="whitespace-pre-wrap break-words font-hand text-[1.35rem] leading-relaxed text-ink">
        {tokens.slice(0, visibleCount).map((tok, i) => {
          if (tok.type === "break") return <br key={i} />;
          if (tok.type === "media") {
            const Renderer = mediaRenderers?.[tok.kind];
            return (
              <motion.span
                key={i}
                className="my-3 block"
                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
              >
                {Renderer ? <Renderer /> : null}
              </motion.span>
            );
          }
          wordCursor += 1;
          const isLast = i === visibleCount - 1;
          return (
            <span key={i} ref={isLast ? lastWordRef : null}>
              {tok.text}
            </span>
          );
        })}
      </div>

      <AnimatePresence>
        {penPos.visible && !done && (
          <motion.div
            className="pointer-events-none absolute z-10"
            animate={{ left: penPos.x, top: penPos.y }}
            transition={{ type: "tween", duration: 0.12 }}
            style={{ position: "absolute" }}
          >
            <PenIcon />
          </motion.div>
        )}
      </AnimatePresence>

      {active && !done && (
        <button
          onClick={skip}
          className="focus-ring mt-4 font-body text-sm text-wine/60 underline underline-offset-2 hover:text-wine"
        >
          Skip to the end
        </button>
      )}
    </div>
  );
}
