import {
  LobbyRealtimePayloadT,
  SpellyLobbySnakeCaseKeysT,
  SpellyLobbyT,
  SpellySnakeToCamelCaseKeys,
} from "@/db/schema/spelly";

export function LobbySnakeToCamelCase(
  lobbyPayload: LobbyRealtimePayloadT
): SpellyLobbyT {
  return Object.entries(lobbyPayload).reduce((prev, [key, value]) => {
    const newKey = SpellySnakeToCamelCaseKeys[key as SpellyLobbySnakeCaseKeysT];
    prev[newKey] = value;
    return prev;
  }, {} as Partial<SpellyLobbyT>) as SpellyLobbyT;
}
