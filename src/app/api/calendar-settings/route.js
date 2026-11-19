import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function GET() {
  try {
    const setting = await dataStore.getCalendarSetting();
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = await dataStore.updateCalendarSetting(body);
    return NextResponse.json({
      success: true,
      message: "Organization calendar settings updated successfully",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
