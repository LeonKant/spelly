import { Dispatch, SetStateAction } from "react";

export type AudioSettingsContextT = {
  mainMusicVolume: number;
  sfxVolume: number;
  setMainMusicVolume: Dispatch<SetStateAction<number>>;
  setSfxVolume: Dispatch<SetStateAction<number>>;
  muted: boolean;
  setMuted: Dispatch<SetStateAction<boolean>>;
};

export type AudioSettingsKeys = "mainMusicVolume" | "sfxVolume";
