import { SpellyLobbyPrevRoundT, SpellyLobbyT } from "./db.type";

type BaseSpellyLobbyContextT = {
  userID: string;
  userName: string;
  lobbyState: SpellyLobbyT;
  prevRoundsState: SpellyLobbyPrevRoundT[];
};

export type SpellyLobbyContextT = {
  isHost: boolean;
  lobbyPlayers: LobbyPlayersT<Partial<LobbyPlayerStatusT>>;
  userNameCacheState: { [key: string]: string };
  subscriptionWaiting: boolean;
} & BaseSpellyLobbyContextT;

export type SpellyLobbyContextPropsT = {
  lobbyPlayers: LobbyPlayersT<LobbyPlayerStatusT>;
} & BaseSpellyLobbyContextT;

export type ChannelUserStatusT = {
  id: string;
  userName: string;
  online_at: string;
};

export type LobbyPlayerStatusT = {
  points: number;
  username: string;
};

export type LobbyPlayersT<T> = {
  [id: string]: T;
};