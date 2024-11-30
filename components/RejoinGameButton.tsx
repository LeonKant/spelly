"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function RejoinGameButton() {
  return (
    <Button
      className="text-lg"
      onClick={() => {
        redirect("/lobby");
      }}
    >
      Rejoin Game
    </Button>
  );
}
