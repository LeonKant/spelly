import { LobbyPlayersT, LobbyPlayerStatusT } from "@/types/lobby-context.type";

export function getWinners(
  lobbyPlayers: LobbyPlayersT<Partial<LobbyPlayerStatusT>>,
) {
  const winners: string[] = [];

  const minPoints: number = Math.min(
    ...Object.values(lobbyPlayers).map(({ points }) => points ?? 27),
  );
  Object.entries(lobbyPlayers).forEach(([id, player]) => {
    if (player.points === minPoints) {
      winners.push(id);
    }
  });

  return winners;
}
