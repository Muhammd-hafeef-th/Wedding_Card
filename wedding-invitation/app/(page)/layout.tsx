"use client";
// app/(page)/layout.tsx
import { useLenis } from "@/hooks/useLenis";
import { ReactNode } from "react";

import AudioProvider from "@/components/ui/AudioProvider";

function LenisProvider({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <AudioProvider>{children}</AudioProvider>
    </LenisProvider>
  );
}
