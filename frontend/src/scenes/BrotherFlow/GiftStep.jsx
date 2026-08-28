import StepShell from '../../components/ui/StepShell.jsx';
import GiftPicker from '../../components/gift/GiftPicker.jsx';
import { isValidAmount } from '../../lib/sanitize.js';

export default function GiftStep({ gift, onChange, onNext }) {
  const hasGift = Boolean(gift.photoPreview) || Boolean(gift.amount);
  const amountOk = isValidAmount(gift.amount);

  return (
    <StepShell onNext={onNext} nextDisabled={!hasGift || !amountOk}>
      <GiftPicker gift={gift} onChange={onChange} />
      {gift.amount && !amountOk && (
        <p className="mt-2 max-w-sm font-body text-sm text-wine">Please enter a valid amount.</p>
      )}
    </StepShell>
  );
}
