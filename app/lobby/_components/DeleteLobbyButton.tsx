"use client";

import { hostEndGameAction } from "@/actions/lobby";
import { Button } from "@/components/ui/button";

export default function DeleteLobbyButton({ userID }: { userID: string }) {
  return (
    <Button
      onClick={() => {
        hostEndGameAction(userID);
      }}
    >
      End game
    </Button>
  );
}
