export type LobbyPlayerStatusT = {
  points: number;
  username: string;
};

export type LobbyPlayersT<T> = {
  [id: string]: T;
};
