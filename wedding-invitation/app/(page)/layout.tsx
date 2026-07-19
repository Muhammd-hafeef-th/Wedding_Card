"use client";
// app/(page)/layout.tsx
import { useLenis } from "@/hooks/useLenis";
import { ReactNode } from "react";

import AudioWrapper from "@/components/ui/AudioWrapper";

function LenisProvider({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <AudioWrapper>{children}</AudioWrapper>
    </LenisProvider>
  );
}
