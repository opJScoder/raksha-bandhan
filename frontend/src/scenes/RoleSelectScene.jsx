import { motion } from 'framer-motion';
import GuideCharacter from '../components/guide/GuideCharacter.jsx';

export default function RoleSelectScene({ onSelect }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-ivory px-6 py-10">
      <GuideCharacter size={56} />
      <h2 className="mt-6 font-display text-4xl text-wine">What are you?</h2>
      <p className="mt-2 font-body text-ink/60">This shapes the whole letter, so let's start here.</p>

      <div className="mt-10 flex w-full max-w-md flex-col gap-5 sm:flex-row">
        <RoleCard label="I'm Brother" sub="Sending a gift to your sister" onClick={() => onSelect('brother')} />
        <RoleCard label="I'm Sister" sub="Sending a rakhi to your brother" onClick={() => onSelect('sister')} />
      </div>
    </div>
  );
}

function RoleCard({ label, sub, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="focus-ring group relative flex-1 rounded-[3px] border border-gold/40 bg-ivory-dim px-6 py-8 text-left shadow-paper"
    >
      <span className="pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full bg-gold-light/70 transition-transform group-hover:scale-150" />
      <p className="font-display text-2xl text-wine">{label}</p>
      <p className="mt-1 font-body text-sm text-ink/60">{sub}</p>
    </motion.button>
  );
}
