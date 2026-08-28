import StepShell from '../components/ui/StepShell.jsx';
import MemoryUpload from '../components/memory/MemoryUpload.jsx';

export default function MemoryStep({ preview, onChange, onNext }) {
  return (
    <StepShell onNext={onNext} nextLabel="Continue">
      <MemoryUpload preview={preview} onChange={onChange} />
    </StepShell>
  );
}
