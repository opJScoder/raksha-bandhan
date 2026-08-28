import { motion } from 'framer-motion';
import GuideCharacter from '../components/guide/GuideCharacter.jsx';
import Button from '../components/ui/Button.jsx';
import { useAudio } from '../components/audio/AudioManager.jsx';

function Diya({ style }) {
  return (
    <div className="absolute" style={style}>
      <svg width="34" height="40" viewBox="0 0 34 40">
        <ellipse cx="17" cy="30" rx="15" ry="7" fill="#B08A38" />
        <ellipse cx="17" cy="27" rx="12" ry="5" fill="#E88932" />
        <motion.path
          d="M17 22 Q13 14 17 8 Q21 14 17 22 Z"
          fill="#F0A25C"
          className="origin-bottom animate-flicker"
        />
        <motion.path d="M17 18 Q15 13 17 9 Q19 13 17 18 Z" fill="#FFF3D0" className="origin-bottom animate-flicker" />
      </svg>
    </div>
  );
}

function Petal({ delay, left }) {
  return (
    <span
      className="absolute top-[-20px] h-3 w-3 rounded-tl-full rounded-br-full bg-rose/70 animate-drift"
      style={{ left, animationDelay: `${delay}s` }}
    />
  );
}

export default function WelcomeScene({ onBegin }) {
  const { muted, toggleMute, ensureStarted } = useAudio();

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-ivory via-ivory to-rose/10 px-6 py-10 grain">
      {/* ambient diyas */}
      <Diya style={{ left: '8%', bottom: '12%' }} />
      <Diya style={{ right: '10%', bottom: '18%' }} />
      <Diya style={{ left: '18%', top: '14%', transform: 'scale(0.7)' }} />

      {/* floating petals */}
      {Array.from({ length: 7 }).map((_, i) => (
        <Petal key={i} delay={i * 0.9} left={`${10 + i * 12}%`} />
      ))}

      <button
        onClick={() => {
          ensureStarted();
          toggleMute();
        }}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
        className="focus-ring absolute right-5 top-5 z-10 rounded-full border border-gold/40 bg-ivory/80 p-2.5 text-wine shadow-paper backdrop-blur"
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" /><path d="M17 8l4 8M21 8l-4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="z-10 flex flex-col items-center text-center"
      >
        <GuideCharacter size={72} />
        <h1 className="mt-6 font-display text-5xl italic text-wine sm:text-6xl">Happy Raksha Bandhan</h1>
        <p className="mt-4 max-w-md font-body text-base text-ink/70 sm:text-lg">
          To every brother who's ever been teased mercilessly, and every sister who's ever tied the thread
          anyway — this one's for the two of you.
        </p>
        <div className="mt-9">
          <Button
            variant="primary"
            onClick={() => {
              ensureStarted();
              onBegin();
            }}
          >
            Begin the letter
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
