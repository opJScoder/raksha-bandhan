import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import WelcomeScene from "../scenes/WelcomeScene.jsx";
import RoleSelectScene from "../scenes/RoleSelectScene.jsx";

import { useAppState } from "../state/AppState.jsx";
import { useAudio } from "../components/audio/AudioManager.jsx";

export default function HomePage() {
  const [phase, setPhase] = useState("welcome");

  const { dispatch } = useAppState();
  const navigate = useNavigate();

  const { ensureStarted, play } = useAudio();

  const handleBegin = () => {
    ensureStarted();
    play("chime");

    dispatch({
      type: "RESET",
    });

    setPhase("travelling");

    window.setTimeout(() => {
      setPhase("role");
    }, 1200);
  };

  const handleRoleSelect = (role) => {
    ensureStarted();
    play("whoosh");
    window.setTimeout(() => {
      navigate(`/create/${role}`);
    }, 400);
  };

  const worldMoving = phase === "travelling" || phase === "role";

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-ivory">
      <motion.div
        className="relative z-10 flex h-[100dvh] w-[200vw] bg-transparent"
        initial={{ x: "0vw" }}
        animate={{ x: worldMoving ? "-100vw" : "0vw" }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="relative h-[100dvh] w-[100vw] shrink-0 bg-transparent">
          <WelcomeScene onBegin={handleBegin} />
        </div>

        <div className="relative h-[100dvh] w-[100vw] shrink-0 bg-transparent">
          <RoleSelectScene onSelect={handleRoleSelect} />
        </div>
      </motion.div>
    </div>
  );
}
