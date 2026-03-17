import { beFetch } from "@/lib/beClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { userId, plan, durationDays } = await request.json();

    if (!userId || !plan || !durationDays) {
      return NextResponse.json(
        { error: "Missing required fields: userId, plan, durationDays" },
        { status: 400 }
      );
    }

    const response = await beFetch(`/api/admin/users/${userId}/subscription`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, durationDays }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Failed to update subscription" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "Missing admin session token") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
