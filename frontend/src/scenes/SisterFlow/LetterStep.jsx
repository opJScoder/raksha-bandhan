import { useMemo, useState } from 'react';
import StepShell from '../../components/ui/StepShell.jsx';
import LetterPaper from '../../components/letter/LetterPaper.jsx';
import LetterWritingEngine from '../../components/letter/LetterWritingEngine.jsx';
import Rakhi from '../../components/rakhi/Rakhi.jsx';
import { sisterLetter } from '../../lib/letterContent.js';

export default function LetterStep({ senderName, recipientName, memoryPreview, onNext }) {
  const [written, setWritten] = useState(false);
  const segments = useMemo(() => sisterLetter({ senderName, recipientName }), [senderName, recipientName]);

  const mediaRenderers = {
    rakhi: () => <Rakhi size={110} />,
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
