"use client";

import { hostEndGameAction } from "@/actions/lobby";
import { Button } from "@/components/ui/button";

export default function DeleteLobbyButton() {
  return (
    <Button
    className="w-fit"
      variant={"destructive"}
      onClick={() => {
        hostEndGameAction();
      }}
    >
      End game
    </Button>
  );
}
