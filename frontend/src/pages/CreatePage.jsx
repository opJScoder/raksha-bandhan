import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppState } from '../state/AppState.jsx';
import GuideTrail from '../components/guide/GuideTrail.jsx';
import NamesStep from '../scenes/NamesStep.jsx';
import MemoryStep from '../scenes/MemoryStep.jsx';
import GiftStep from '../scenes/BrotherFlow/GiftStep.jsx';
import BrotherLetterStep from '../scenes/BrotherFlow/LetterStep.jsx';
import RakhiStep from '../scenes/SisterFlow/RakhiStep.jsx';
import SisterLetterStep from '../scenes/SisterFlow/LetterStep.jsx';
import SendStep from '../scenes/SendStep.jsx';
import ShareScene from '../scenes/ShareScene.jsx';

const FLOWS = {
  brother: ['names', 'gift', 'memory', 'letter', 'send', 'share'],
  sister: ['names', 'rakhi', 'memory', 'letter', 'send', 'share'],
};

export default function CreatePage() {
  const { role } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [stepIndex, setStepIndex] = useState(0);
  const [shareResult, setShareResult] = useState(null);

  const flow = FLOWS[role];

  useEffect(() => {
    if (!flow) {
      navigate('/', { replace: true });
      return;
    }
    if (state.role !== role) {
      dispatch({ type: 'SET_ROLE', role });
    }
    const replyTo = searchParams.get('replyTo');
    if (replyTo) dispatch({ type: 'SET_PARENT', slug: replyTo });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  if (!flow) return null;

  const goNext = () => {
    dispatch({ type: 'SET_TRAVELLING', value: true });
  };

  const advance = () => {
    dispatch({ type: 'SET_TRAVELLING', value: false });
    setStepIndex((i) => Math.min(i + 1, flow.length - 1));
  };

  const step = flow[stepIndex];

  return (
    <>
      <GuideTrail active={state.travelling} onComplete={advance} />

      {step === 'names' && (
        <NamesStep
          role={role}
          initialSender={state.senderName}
          initialRecipient={state.recipientName}
          onNext={(sender, recipient) => {
            dispatch({ type: 'SET_NAMES', senderName: sender, recipientName: recipient });
            goNext();
          }}
        />
      )}

      {step === 'gift' && (
        <GiftStep gift={state.gift} onChange={(gift) => dispatch({ type: 'SET_GIFT', gift })} onNext={goNext} />
      )}

      {step === 'rakhi' && (
        <RakhiStep
          onNext={() => {
            dispatch({ type: 'SET_RAKHI_SENT', value: true });
            goNext();
          }}
        />
      )}

      {step === 'memory' && (
        <MemoryStep
          preview={state.memoryPreview}
          onChange={(file, preview) => dispatch({ type: 'SET_MEMORY', file, preview })}
          onNext={goNext}
        />
      )}

      {step === 'letter' && role === 'brother' && (
        <BrotherLetterStep
          senderName={state.senderName}
          recipientName={state.recipientName}
          gift={state.gift}
          memoryPreview={state.memoryPreview}
          onNext={goNext}
        />
      )}

      {step === 'letter' && role === 'sister' && (
        <SisterLetterStep
          senderName={state.senderName}
          recipientName={state.recipientName}
          memoryPreview={state.memoryPreview}
          onNext={goNext}
        />
      )}

      {step === 'send' && (
        <SendStep
          state={state}
          onDone={(result) => {
            setShareResult(result);
            goNext();
          }}
        />
      )}

      {step === 'share' && shareResult && <ShareScene role={role} url={shareResult.url} />}
    </>
  );
}
