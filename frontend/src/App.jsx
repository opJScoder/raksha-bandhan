import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import GiftPage from "./pages/GiftPage.jsx";

import GuideCharacter from "./components/guide/GuideCharacter.jsx";
import MuteButton from "./components/audio/MuteButton.jsx";
import ReceiveScene from "./scenes/ReceiveScene.jsx";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center gap-4 overflow-hidden bg-ivory px-6 text-center">
      <GuideCharacter size={48} />

      <p className="font-display text-2xl text-wine">
        This page wandered off somewhere festive.
      </p>

      <Link
        to="/"
        className="focus-ring font-body text-sm text-wine underline underline-offset-2"
      >
        Back home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <>
      {/* Always stays attached to the viewport */}
      <MuteButton />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/create/:role" element={<CreatePage />} />

        <Route path="/gift/:slug" element={<GiftPage />} />

        <Route path="/gift/:slug" element={<ReceiveScene />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
