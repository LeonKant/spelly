import { RefObject } from "react";

export type LobbyAudioContextT = {
  playRoundLoseAudio: () => void;
  playCorrectLetterAudio: () => void;
  playGameEndMusic: (wonGame: boolean) => void;
};

export type sfxAudioDataKeyT =
  | "mainLobby"
  | "roundLoss"
  | "correctLetter"
  | "gameLost"
  | "gameWon";

export type sfxAudioDataT = {
  [key in sfxAudioDataKeyT]: {
    src: string;
    ref: RefObject<HTMLAudioElement | null>;
  };
};
