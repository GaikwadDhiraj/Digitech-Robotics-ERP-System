import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function GET() {
  try {
    const holidays = await dataStore.getHolidays();
    return NextResponse.json({ success: true, data: holidays });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
