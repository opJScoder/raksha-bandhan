import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GuideCharacter from '../components/guide/GuideCharacter.jsx';
import Button from '../components/ui/Button.jsx';

export default function ShareScene({ role, url }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const shareText =
    role === 'brother' ? 'Copy the link and share it with your pretty sis.' : 'Copy the link and share it with your strong bro.';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the link is still visible to select manually */
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'A Raksha Bandhan letter for you', url });
      } catch {
        /* user cancelled share sheet — no action needed */
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-ivory px-6 py-12 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <GuideCharacter size={60} />
        <h2 className="mt-5 font-display text-3xl text-wine">Your letter is ready.</h2>
        <p className="mt-2 max-w-sm font-body text-ink/70">{shareText}</p>

        <div className="mt-6 w-full max-w-sm rounded-[3px] border border-gold/40 bg-ivory-dim px-4 py-3">
          <p className="truncate font-body text-sm text-ink/80">{url}</p>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3">
          <Button onClick={handleNativeShare} variant="gold">
            Share the letter
          </Button>
          <button onClick={handleCopy} className="focus-ring font-body text-sm text-wine underline underline-offset-2">
            {copied ? 'Copied!' : 'Or just copy the link'}
          </button>
        </div>

        <div className="mt-10 border-t border-gold/20 pt-6">
          <p className="mb-3 font-body text-sm text-ink/60">Want to send more?</p>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
