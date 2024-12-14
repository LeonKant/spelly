import { joinLobbyAction } from "@/actions/lobby";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestUrl = new URL(request.url);
  const { id: lobbyId } = await params;

  const origin = requestUrl.origin;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/sign-in`);
  }

  if (!lobbyId) {
    return NextResponse.redirect(`${origin}`);
  }

  const { error } = await joinLobbyAction(lobbyId);

  if (error) {
    return NextResponse.redirect(`${origin}`);
  }
}
