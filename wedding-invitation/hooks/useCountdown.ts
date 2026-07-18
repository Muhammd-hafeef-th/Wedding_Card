"use client";
// hooks/useCountdown.ts
import { useState, useEffect } from "react";
import { getCountdownValues } from "@/lib/utils";

export function useCountdown(targetDate: string, targetTime?: string) {
  const [values, setValues] = useState(getCountdownValues(targetDate, targetTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(getCountdownValues(targetDate, targetTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return values;
}
