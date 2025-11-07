import { NextResponse } from "next/server";
import { loadHostawayReviews } from "@/lib/hostaway";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const useMockParam = searchParams.get("mock");

  const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
  const useMock = useMockParam === "true";

  try {
    const payload = await loadHostawayReviews({ limit, useMock });
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "hostaway_fetch_failed",
        message,
      },
      {
        status: 500,
      },
    );
  }
}

