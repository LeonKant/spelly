"use client";
import { Volume2, VolumeX } from "lucide-react";
import { Toggle } from "./ui/toggle";
import { Ref } from "react";
import { useAudioSettings } from "@/context/AudioSettingsContext";

export function AudioToggle({ ref }: { ref?: Ref<HTMLButtonElement> }) {
  const { muted, setMuted } = useAudioSettings();
  return (
    <Toggle
      ref={ref}
      aria-label="Toggle audio mute"
      onPressedChange={(pressed) => {
        setMuted(pressed);
      }}
    >
      {muted ? <VolumeX /> : <Volume2 />}
    </Toggle>
  );
}
