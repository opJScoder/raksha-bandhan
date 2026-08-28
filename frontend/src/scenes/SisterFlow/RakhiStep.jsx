import { useState } from 'react';
import StepShell from '../../components/ui/StepShell.jsx';
import Rakhi from '../../components/rakhi/Rakhi.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAudio } from '../../components/audio/AudioManager.jsx';

export default function RakhiStep({ onNext }) {
  const [sent, setSent] = useState(false);
  const { play } = useAudio();

  const handleSend = () => {
    play('chime');
    setSent(true);
    setTimeout(() => onNext(), 750);
  };

  return (
    <StepShell hideNext>
      <p className="mb-6 font-display text-2xl text-wine">A rakhi, chosen for him</p>
      <Rakhi sent={sent} />
      <div className="mt-8">
        <Button onClick={handleSend} disabled={sent}>
          Send the Rakhi
        </Button>
      </div>
    </StepShell>
  );
}
