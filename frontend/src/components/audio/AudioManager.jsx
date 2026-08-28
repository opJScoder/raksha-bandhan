import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const AudioContext_ = createContext(null);

/**
 * Central audio controller.
 *
 * Background music: looks for /music.mp3 in the public folder (drop your
 * own royalty-free festive track there — see README). If it's missing,
 * the app stays fully silent and functional; nothing breaks.
 *
 * Sound effects (bell, pen-scratch, paper, whoosh) are synthesised on the
 * fly with the Web Audio API so the project needs no bundled SFX assets.
 */
export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const musicRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/music.mp3');
    audio.loop = true;
    audio.volume = 0.28;
    audio.preload = 'auto';
    audio.addEventListener('error', () => {
      // No music file supplied — fail silently, app remains fully usable.
      musicRef.current = null;
    });
    musicRef.current = audio;
    return () => {
      audio.pause();
      musicRef.current = null;
    };
  }, []);

  const ensureStarted = useCallback(() => {
    if (started) return;
    setStarted(true);
    if (musicRef.current && !muted) {
      musicRef.current.play().catch(() => {
        /* autoplay blocked — will retry on next interaction */
      });
    }
  }, [started, muted]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (musicRef.current) {
        if (next) musicRef.current.pause();
        else musicRef.current.play().catch(() => {});
      }
      return next;
    });
  }, []);

  const getCtx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    return ctxRef.current;
  };

  // Tiny procedural sound effects, all short + soft by design.
  const play = useCallback(
    (kind) => {
      if (muted) return;
      const ctx = getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const tone = (freq, start, dur, type = 'sine', gain = 0.06) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, now + start);
        g.gain.linearRampToValueAtTime(gain, now + start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.05);
      };

      if (kind === 'bell') {
        tone(880, 0, 0.9, 'sine', 0.08);
        tone(1320, 0.03, 0.7, 'sine', 0.04);
      } else if (kind === 'pen') {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
        noise.buffer = buffer;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.05, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        noise.connect(g).connect(ctx.destination);
        noise.start(now);
      } else if (kind === 'paper') {
        tone(220, 0, 0.25, 'triangle', 0.03);
      } else if (kind === 'whoosh') {
        tone(180, 0, 0.4, 'sawtooth', 0.02);
        tone(90, 0.1, 0.3, 'sawtooth', 0.02);
      } else if (kind === 'chime') {
        tone(660, 0, 0.5, 'sine', 0.06);
        tone(990, 0.08, 0.5, 'sine', 0.05);
        tone(1320, 0.16, 0.6, 'sine', 0.04);
      }
    },
    [muted]
  );

  return (
    <AudioContext_.Provider value={{ muted, toggleMute, ensureStarted, play }}>
      {children}
    </AudioContext_.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext_);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
