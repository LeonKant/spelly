import {
  lobbiesInSpelly,
  lobbyPrevRoundsInSpelly,
  profilesInSpelly,
} from "@/db/schema/spelly";
import {
  SpellyLobbyRealtimePayloadT,
  SpellyPrevRoundRealtimePayloadT,
} from "./realtime.type";

export type SpellyProfileT = typeof profilesInSpelly.$inferSelect;

export type SpellyLobbyInsertT = typeof lobbiesInSpelly.$inferInsert;
export type SpellyLobbyT = typeof lobbiesInSpelly.$inferSelect;

export const SpellyLobbySnakeToCamelCaseKeys: Record<
  keyof SpellyLobbyRealtimePayloadT,
  keyof SpellyLobbyT
> = {
  id: "id",
  host_id: "hostId",
  current_letter: "currentLetter",
  current_player: "currentPlayer",
  game_state: "gameState",
  game_started: "gameStarted",
  name: "name",
  game_over: "gameOver",
  lobby_player_ids: "lobbyPlayerIds",
};

export type SpellyLobbyPrevRoundT = typeof lobbyPrevRoundsInSpelly.$inferSelect;
export type SpellyLobbyPrevRoundInsertT =
  typeof lobbyPrevRoundsInSpelly.$inferInsert;

export const SpellyPrevRoundsSnakeToCamelCaseKeys: Record<
  keyof SpellyPrevRoundRealtimePayloadT,
  keyof SpellyLobbyPrevRoundT
> = {
  id: "id",
  lobby_id: "lobbyId",
  game_state: "gameState",
  loser_user_name: "loserUserName",
  time_added: "timeAdded",
};

export type LobbyInfoUpdateT = Omit<
  Partial<SpellyLobbyT>,
  "hostId" | "id" | "lobbyPlayerIds"
>;
