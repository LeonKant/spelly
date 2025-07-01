import { sfxAudioDataT } from "@/types/lobby-audio-context.type";
import { useRef } from "react";

export const useAudioData = () => {
  const audioData: sfxAudioDataT = {
    mainLobby: {
      src: "music/Spelly - Gameplay Loop.mp3",
      ref: useRef<HTMLAudioElement | null>(null),
    },
    roundLoss: {
      src: "music/Spelly - Round Loss.mp3",
      ref: useRef<HTMLAudioElement | null>(null),
    },
    correctLetter: {
      src: "music/Spelly - Confirm Correct Letter.mp3",
      ref: useRef<HTMLAudioElement | null>(null),
    },
    gameWon: {
      src: "music/Spelly - Win Game Music.mp3",
      ref: useRef<HTMLAudioElement | null>(null),
    },
    gameLost: {
      src: "music/Spelly - Lose Game Sound.mp3",
      ref: useRef<HTMLAudioElement | null>(null),
    },
  };

  return {
    audioData,
  };
};
