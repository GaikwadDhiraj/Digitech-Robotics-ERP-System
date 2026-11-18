import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const year = parseInt(searchParams.get("year") || "2026", 10);

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    const balances = await dataStore.getEmployeeBalances(userId, year);
    return NextResponse.json({ success: true, data: balances });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
