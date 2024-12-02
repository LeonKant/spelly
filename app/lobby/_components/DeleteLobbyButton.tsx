"use client";

import { hostEndGameAction } from "@/actions/lobby";
import { Button } from "@/components/ui/button";

export default function DeleteLobbyButton() {
  return (
    <Button
      variant={"destructive"}
      onClick={() => {
        hostEndGameAction();
      }}
    >
      End game
    </Button>
  );
}
