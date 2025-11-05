"use client";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useAudioSettings } from "./AudioSettingsContext";
import { useSpellyLobby } from "./LobbyContext";
import { LobbyAudioContextT } from "@/types/lobby-audio-context.type";
import { useAudioData } from "@/hooks/useAudioData";

const LobbyAudioContext = createContext<LobbyAudioContextT | null>(null);

export const useLobbyAudio = () => {
  const context = useContext(LobbyAudioContext);
  if (!context) {
    throw new Error("useLobbyAudio must be used within a LobbyAudioProvider.");
  }
  return context;
};

export const LobbyAudioProvider = ({ children }: PropsWithChildren) => {
  const { mainMusicVolume, sfxVolume, muted } = useAudioSettings();
  const {
    lobbyState: { gameStarted, gameOver },
    winners,
    userID,
  } = useSpellyLobby();
  const { audioData } = useAudioData();
  const mainLobbyAudioRef = useRef<HTMLAudioElement | null>(null);

  const playAudioInterupt =
    (audioRef: RefObject<HTMLAudioElement | null>) => () => {
      if (!mainLobbyAudioRef.current || muted) return;

      mainLobbyAudioRef.current.pause();

      if (!audioRef.current) {
        mainLobbyAudioRef.current.play();
        return;
      }

      audioRef.current.onended = () => {
        setTimeout(() => {
          mainLobbyAudioRef.current?.play();

          if (!!audioRef.current) {
            audioRef.current.onended = null;
          }
        }, 0.1 * 1000);
      };
      try {
        audioRef.current.play();
      } catch {
        audioRef.current.onended = null;
        mainLobbyAudioRef.current.play();
      }
    };

  const muteSfx = () =>
    Object.values(audioData).forEach(({ ref }) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

  const muteAll = () => {
    muteSfx();
    if (mainLobbyAudioRef.current) {
      mainLobbyAudioRef.current.pause();
      mainLobbyAudioRef.current.currentTime = 0;
    }
  };
  const playRoundLoseAudio = playAudioInterupt(audioData.roundLoss.ref);
  const playCorrectLetterAudio = playAudioInterupt(audioData.correctLetter.ref);
  const playGameEndMusic = (wonGame: boolean) => {
    if (muted) return;
    muteAll();

    const audioRef = audioData[wonGame ? "gameWon" : "gameLost"].ref;
    if (!audioRef.current) return;
    audioRef.current.play().catch(() => console.log(85));
  };

  // handle changes in volume from global audio settings
  useEffect(() => {
    console.log("lobby volume change useEffect triggered");
    Object.values(audioData).forEach((r) => {
      const { ref } = r;
      if (!!ref.current) {
        ref.current.volume = sfxVolume / 100;
        console.log(`${r.src}:`, ref.current.volume);
      }
    });
    if (!!mainLobbyAudioRef.current) {
      mainLobbyAudioRef.current.volume = mainMusicVolume / 100;
      console.log(
        "mainLobbyAudioRef.current.volume:",
        mainLobbyAudioRef.current.volume,
      );
    }
  }, [sfxVolume, mainMusicVolume]);

  // handle muting based on global audio settings
  useEffect(() => {
    mainLobbyAudioRef.current?.[muted ? "pause" : "play"]();
  }, [mainMusicVolume, muted]);

  // handle transition from gameOver to gameStart
  useEffect(() => {
    if (!gameOver && gameStarted && winners.length === 0) {
      muteSfx();
      if (muted) return;
      mainLobbyAudioRef.current?.play().catch(() => console.log(109));
    }
    if (gameOver && gameStarted && winners.length > 0) {
      playGameEndMusic(winners.includes(userID));
    }
  }, [gameStarted, gameOver, winners, muted]);

  return (
    <LobbyAudioContext.Provider
      value={{ playRoundLoseAudio, playCorrectLetterAudio, playGameEndMusic }}
    >
      {children}
      <audio
        ref={mainLobbyAudioRef}
        src="music/Spelly - Gameplay Loop.mp3"
        loop
      />

      {Object.entries(audioData).map(([k, d], i) => (
        <audio {...d} key={`${k}-${i}`} />
      ))}
    </LobbyAudioContext.Provider>
  );
};
