import { useState } from 'react';
import StepShell from '../components/ui/StepShell.jsx';
import TextInput from '../components/ui/TextInput.jsx';
import { isValidName } from '../lib/sanitize.js';

export default function NamesStep({ role, initialSender, initialRecipient, onNext }) {
  const [sender, setSender] = useState(initialSender || '');
  const [recipient, setRecipient] = useState(initialRecipient || '');

  const senderLabel = role === 'brother' ? 'Your good name?' : 'Your pretty name?';
  const recipientLabel = role === 'brother' ? "Your sister's pretty name?" : "Your brother's good name?";

  const valid = isValidName(sender) && isValidName(recipient);

  return (
    <StepShell onNext={() => valid && onNext(sender.trim(), recipient.trim())} nextDisabled={!valid}>
      <div className="flex w-full max-w-sm flex-col gap-8">
        <TextInput label={senderLabel} value={sender} onChange={setSender} placeholder="e.g. Rahul" autoFocus />
        <TextInput label={recipientLabel} value={recipient} onChange={setRecipient} placeholder="e.g. Priya" />
      </div>
    </StepShell>
  );
}
