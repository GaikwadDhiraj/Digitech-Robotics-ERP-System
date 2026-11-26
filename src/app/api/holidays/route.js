import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const holidays = await dataStore.getHolidays(year ? parseInt(year, 10) : undefined);
    return NextResponse.json({ success: true, data: holidays });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.date || !body.name) {
      return NextResponse.json(
        { success: false, error: "Date and Name are required" },
        { status: 400 }
      );
    }
    const holiday = await dataStore.createHoliday(body);
    return NextResponse.json({ success: true, data: holiday }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Holiday ID is required" }, { status: 400 });
    }
    await dataStore.deleteHoliday(id);
    return NextResponse.json({ success: true, message: "Holiday removed successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
