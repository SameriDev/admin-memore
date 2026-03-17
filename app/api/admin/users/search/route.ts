import { beFetch } from "@/lib/beClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email param" }, { status: 400 });
  }

  try {
    const response = await beFetch(`/api/admin/users/search?email=${encodeURIComponent(email)}`);

    if (response.status === 404 || !response.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "Missing admin session token") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
