"use client";
// components/ui/AudioWrapper.tsx
import { useEffect, useState, type ReactNode } from "react";
import AudioProvider from "@/components/ui/AudioProvider";

export default function AudioWrapper({ children }: { children: ReactNode }) {
  const [musicUrl, setMusicUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;

    async function loadMusicUrl() {
      try {
        const response = await fetch("/api/wedding");
        if (!response.ok) return;
        const data = await response.json();
        if (active && data?.heroMusicUrl) {
          setMusicUrl(data.heroMusicUrl);
        }
      } catch (error) {
        console.error("Failed to load wedding audio URL:", error);
      }
    }

    loadMusicUrl();

    return () => {
      active = false;
    };
  }, []);

  return <AudioProvider musicUrl={musicUrl}>{children}</AudioProvider>;
}
