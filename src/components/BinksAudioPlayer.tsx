"use client";

import React, { useEffect, useRef, useState } from "react";
import { Music, Pause, Volume2 } from "lucide-react";

export default function BinksAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;

    const tryPlay = async () => {
      if (userPausedRef.current) return false;
      try {
        await audio.play();
        setPlaying(true);
        return true;
      } catch {
        setPlaying(false);
        return false;
      }
    };

    const removeUnlockListeners = () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    const handleFirstInteraction = async () => {
      if (userPausedRef.current) {
        removeUnlockListeners();
        return;
      }
      const started = await tryPlay();
      if (started) {
        removeUnlockListeners();
      }
    };

    // Attempt immediate autoplay; if blocked by browser policy, start on first tap/key
    tryPlay().then((started) => {
      if (!started && !userPausedRef.current) {
        window.addEventListener("pointerdown", handleFirstInteraction, {
          passive: true,
        });
        window.addEventListener("keydown", handleFirstInteraction, {
          passive: true,
        });
      }
    });

    return () => {
      removeUnlockListeners();
    };
  }, []);

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      userPausedRef.current = true;
      audio.pause();
      setPlaying(false);
    } else {
      userPausedRef.current = false;
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/binks-no-sake.mp3"
        loop
        preload="auto"
      />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause Binks' Sake" : "Play Binks' Sake"}
        className={`fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border-[3px] border-ink px-3.5 py-2 text-xs font-extrabold text-ink shadow-ink-sm transition hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:text-sm ${
          playing ? "bg-sun" : "bg-paper hover:bg-sun/60"
        }`}
      >
        {playing ? (
          <>
            <Volume2 className="h-4 w-4 shrink-0 text-luffy" />
            <span>Binks&apos; Sake</span>
            <Pause className="h-3.5 w-3.5 shrink-0 opacity-70" />
          </>
        ) : (
          <>
            <Music className="h-4 w-4 shrink-0 text-luffy" />
            <span>Play Binks&apos; Sake</span>
          </>
        )}
      </button>
    </>
  );
}

