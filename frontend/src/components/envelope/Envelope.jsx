import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../audio/AudioManager.jsx';
import PenIcon from '../letter/PenIcon.jsx';
import GuideCharacter from '../guide/GuideCharacter.jsx';

const STAGES = ['folding', 'sealed', 'flipped', 'addressing', 'carried'];

export default function Envelope({ senderName, recipientName, wish, onComplete }) {
  const [stageIndex, setStageIndex] = useState(0);
  const { play } = useAudio();
  const stage = STAGES[stageIndex];

  useEffect(() => {
    play(stage === 'folding' ? 'paper' : stage === 'sealed' ? 'bell' : stage === 'carried' ? 'whoosh' : undefined);
    const durations = { folding: 900, sealed: 700, flipped: 700, addressing: 2200, carried: 900 };
    const t = setTimeout(() => {
      if (stageIndex < STAGES.length - 1) setStageIndex((i) => i + 1);
      else onComplete?.();
    }, durations[stage]);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIndex]);

  return (
    <div className="relative mx-auto flex min-h-[320px] w-full max-w-md flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === 'folding' && (
          <motion.div
            key="fold"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
            className="h-64 w-52 rounded-[3px] border border-gold/40 bg-ivory shadow-paper"
          />
        )}

        {(stage === 'sealed' || stage === 'flipped' || stage === 'addressing' || stage === 'carried') && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: stage === 'flipped' || stage === 'addressing' ? 180 : 0,
              y: stage === 'carried' ? -20 : 0,
            }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative"
          >
            <EnvelopeBody showAddress={stage === 'addressing' || stage === 'carried'} senderName={senderName} recipientName={recipientName} wish={wish} />
          </motion.div>
        )}
      </AnimatePresence>

      {stage === 'carried' && (
        <motion.div
          className="absolute bottom-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 30, y: -10 }}
          transition={{ duration: 0.9 }}
        >
          <GuideCharacter size={40} mood="excited" />
        </motion.div>
      )}
    </div>
  );
}

function EnvelopeBody({ showAddress, senderName, recipientName, wish }) {
  return (
    <div className="relative h-56 w-72 rounded-[3px] border border-gold/50 bg-ivory-dim shadow-paper" style={{ backfaceVisibility: 'hidden' }}>
      {/* envelope flap */}
      <svg className="absolute -top-1 left-0 h-24 w-full text-gold/30" viewBox="0 0 288 96" preserveAspectRatio="none">
        <path d="M0 0 L144 84 L288 0 Z" fill="currentColor" stroke="#D4A84F" strokeWidth="1" />
      </svg>
      {/* wax seal */}
      <div className="absolute left-1/2 top-14 h-9 w-9 -translate-x-1/2 rounded-full bg-wine shadow-glow ring-2 ring-gold-light/70" />

      {showAddress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 flex flex-col items-start justify-end gap-2 px-8 pb-8 font-hand text-lg text-ink"
          style={{ transform: 'scaleX(-1)' }}
        >
          <div style={{ transform: 'scaleX(-1)' }}>
            <TypedLine text={`From, ${senderName}`} delay={0} />
            <TypedLine text={`To, ${recipientName}`} delay={1.1} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function TypedLine({ text, delay }) {
  return (
    <div className="relative flex items-center gap-1">
      <motion.span
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ delay, duration: 0.9, ease: 'easeInOut' }}
      >
        {text}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: [0, 1, 0], x: 60 }}
        transition={{ delay, duration: 0.9, ease: 'easeInOut' }}
        className="absolute"
      >
        <PenIcon size={18} />
      </motion.span>
    </div>
  );
}
