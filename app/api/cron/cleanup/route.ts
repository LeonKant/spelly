import { SERVER } from "@/config/var.config";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${SERVER.cronSecret}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  return Response.json({ success: true });
}
