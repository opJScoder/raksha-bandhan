import { useMemo, useState } from 'react';
import StepShell from '../../components/ui/StepShell.jsx';
import LetterPaper from '../../components/letter/LetterPaper.jsx';
import LetterWritingEngine from '../../components/letter/LetterWritingEngine.jsx';
import { brotherLetter } from '../../lib/letterContent.js';

export default function LetterStep({ senderName, recipientName, gift, memoryPreview, onNext }) {
  const [written, setWritten] = useState(false);
  const segments = useMemo(
    () => brotherLetter({ senderName, recipientName, gift }),
    [senderName, recipientName, gift]
  );

  const mediaRenderers = {
    gift: () =>
      gift.photoPreview ? (
        <img src={gift.photoPreview} alt="Gift" className="mx-auto max-h-56 rounded-[3px] border border-gold/40 shadow-paper" />
      ) : (
        <span className="mx-auto block w-fit rounded-[3px] border border-gold/40 bg-gold/10 px-6 py-3 font-display text-2xl text-wine">
          ₹{Number(gift.amount).toLocaleString('en-IN')}
        </span>
      ),
    memory: () =>
      memoryPreview ? (
        <img src={memoryPreview} alt="A memory" className="mx-auto max-h-56 rounded-[3px] border border-gold/40 shadow-paper" />
      ) : null,
  };

  return (
    <StepShell onNext={onNext} nextLabel="Send the letter" hideNext={!written} nextDisabled={!written}>
      <LetterPaper>
        <LetterWritingEngine segments={segments} mediaRenderers={mediaRenderers} onComplete={() => setWritten(true)} />
      </LetterPaper>
    </StepShell>
  );
}
