import { useAudio } from "./AudioManager.jsx";

export default function MuteButton() {
  const { muted, toggleMute, ensureStarted } = useAudio();

  return (
    <button
      onClick={() => {
        ensureStarted();
        toggleMute();
      }}
      aria-label={muted ? "Unmute music" : "Mute music"}
      className="focus-ring fixed right-5 top-5 z-50 rounded-full border border-gold/40 bg-ivory/80 p-2.5 text-wine shadow-paper backdrop-blur"
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" />
          <path
            d="M17 8l4 8M21 8l-4 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" />
          <path
            d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
