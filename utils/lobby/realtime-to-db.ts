import {
  SpellyLobbyPrevRoundT,
  SpellyLobbySnakeToCamelCaseKeys,
  SpellyLobbyT,
  SpellyPrevRoundsSnakeToCamelCaseKeys,
} from "@/types/db.type";
import {
  SpellyLobbyRealtimePayloadT,
  SpellyPrevRoundRealtimePayloadT,
} from "@/types/realtime.type";

function snakeToCamelCase<
  RealTimeT extends Record<string, any>,
  SchemaT extends Record<string, any>,
>(
  payload: RealTimeT,
  snakeToCamelMap: Record<keyof RealTimeT, keyof SchemaT>,
): SchemaT {
  return Object.entries(payload).reduce((prev, [key, value]) => {
    const newKey = snakeToCamelMap[key as keyof RealTimeT];
    prev[newKey] = value;
    return prev;
  }, {} as Partial<SchemaT>) as SchemaT;
}

export function LobbySnakeToCamelCase(
  lobbyPayload: SpellyLobbyRealtimePayloadT,
): SpellyLobbyT {
  return snakeToCamelCase<SpellyLobbyRealtimePayloadT, SpellyLobbyT>(
    lobbyPayload satisfies SpellyLobbyRealtimePayloadT,
    SpellyLobbySnakeToCamelCaseKeys,
  );
}

export function PrevRoundsSnakeToCamelCase(
  prevRoundsPayload: SpellyPrevRoundRealtimePayloadT,
) {
  return snakeToCamelCase<
    SpellyPrevRoundRealtimePayloadT,
    SpellyLobbyPrevRoundT
  >(
    prevRoundsPayload satisfies SpellyPrevRoundRealtimePayloadT,
    SpellyPrevRoundsSnakeToCamelCaseKeys,
  );
}
