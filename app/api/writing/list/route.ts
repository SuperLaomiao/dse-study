import { NextResponse } from "next/server";
import { resolveRouteUser } from "@/lib/api-auth";
import { getAllWritingPrompts } from "@/lib/data/writing";

export async function GET(request: Request) {
  try {
    const routeUser = await resolveRouteUser(request);
    if ("response" in routeUser) {
      return routeUser.response;
    }

    const prompts = await getAllWritingPrompts();
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("Error getting writing prompts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
