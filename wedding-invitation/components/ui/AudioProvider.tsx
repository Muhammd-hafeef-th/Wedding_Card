"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { motion } from "framer-motion";

interface AudioContextType {
  isPlaying: boolean;
  playMusic: () => void;
  toggleMusic: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  playMusic: () => {},
  toggleMusic: () => {},
});

export const useAudio = () => useContext(AudioContext);

export default function AudioProvider({ children, musicUrl }: { children: React.ReactNode; musicUrl?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Default fallback music if not provided
    const url = musicUrl || "/music/default-wedding-music.mp3"; 
    
    // We don't autoplay on mount to respect browser policies.
    // We just initialize the Howl instance.
    soundRef.current = new Howl({
      src: [url],
      loop: true,
      volume: 0, // start at 0 for fade in
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [musicUrl]);

  const playMusic = () => {
    if (!soundRef.current || isPlaying) return;
    setIsPlaying(true);
    soundRef.current.play();
    soundRef.current.fade(0, 0.5, 1000); // fade in over 1s to 50% volume
  };

  const toggleMusic = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      soundRef.current.fade(0, 0.5, 500);
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, playMusic, toggleMusic }}>
      {children}
      
      {/* Floating Music Toggle Button */}
      <motion.button
        onClick={toggleMusic}
        className="fixed bottom-6 left-6 z-[999] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer overflow-visible"
        style={{ background: "var(--bg-main)", border: "1px solid var(--gold)" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid var(--gold)" }}
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="text-xl relative z-10" style={{ filter: "drop-shadow(0 0 2px rgba(212,175,55,0.5))" }}>
          {isPlaying ? "🎵" : "🔇"}
        </span>
      </motion.button>
    </AudioContext.Provider>
  );
}
