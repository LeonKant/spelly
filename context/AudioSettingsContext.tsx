"use client";
import { AudioSettingsContextT } from "@/types/audio-settings-context.type";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const AudioSettingsContext = createContext<AudioSettingsContextT | null>(null);

export const useAudioSettings = () => {
  const context = useContext(AudioSettingsContext);
  if (!context) {
    throw new Error(
      "useAudioSettings must be used within a AudioSettingsProvider.",
    );
  }
  return context;
};

export const AudioSettingsProvider = ({ children }: PropsWithChildren) => {
  const [mainMusicVolume, setMainMusicVolume] = useState<number>(50);
  const [sfxVolume, setSfxVolume] = useState<number>(50);
  const [muted, setMuted] = useState<boolean>(true);

  console.log("mainMusicVolume:", mainMusicVolume);
  console.log("sfxVolume:", sfxVolume);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    addEventListener(
      "storage",
      (e) => {
        if (e.key !== "mainMusicVolume" && e.key !== "sfxVolume") return;

        const value = localStorage.getItem(e.key);
        if (value === null) return;

        let storageInt = parseInt(value);
        storageInt = Number.isNaN(storageInt) ? 0 : storageInt;

        if (e.key === "mainMusicVolume") {
          setMainMusicVolume(storageInt);
        } else {
          setSfxVolume(storageInt);
        }
      },
      { signal },
    );

    const mainMusicStorageVal = localStorage.getItem("mainMusicVolume");
    if (mainMusicStorageVal !== null) {
      const mainMusicInt = parseInt(mainMusicStorageVal);
      setMainMusicVolume(Number.isNaN(mainMusicInt) ? 0 : mainMusicInt);
    }

    const sfxStorageVal = localStorage.getItem("sfxVolume");
    if (sfxStorageVal !== null) {
      const sfxInt = parseInt(sfxStorageVal);
      setSfxVolume(Number.isNaN(sfxInt) ? 0 : sfxInt);
    }

    return () => controller.abort();
  }, []);

  return (
    <AudioSettingsContext.Provider
      value={{
        mainMusicVolume,
        sfxVolume,
        setMainMusicVolume,
        setSfxVolume,
        muted,
        setMuted,
      }}
    >
      {children}
    </AudioSettingsContext.Provider>
  );
};
