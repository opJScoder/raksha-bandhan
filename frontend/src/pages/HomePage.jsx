import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeScene from '../scenes/WelcomeScene.jsx';
import RoleSelectScene from '../scenes/RoleSelectScene.jsx';
import GuideTrail from '../components/guide/GuideTrail.jsx';
import { useAppState } from '../state/AppState.jsx';

export default function HomePage() {
  const [phase, setPhase] = useState('welcome'); // welcome | travelling | role
  const { dispatch } = useAppState();
  const navigate = useNavigate();

  return (
    <>
      <GuideTrail active={phase === 'travelling'} onComplete={() => setPhase('role')} />
      {phase === 'welcome' && (
        <WelcomeScene
          onBegin={() => {
            dispatch({ type: 'RESET' });
            setPhase('travelling');
          }}
        />
      )}
      {phase === 'role' && <RoleSelectScene onSelect={(role) => navigate(`/create/${role}`)} />}
    </>
  );
}
