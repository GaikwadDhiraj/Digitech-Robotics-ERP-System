import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    const leaves = await dataStore.getLeaves({ userId, status });
    return NextResponse.json({ success: true, data: leaves });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      leaveType,
      startDate,
      endDate,
      daysCount,
      isHalfDay,
      halfDayType,
      reason,
      inchargePerson,
      contactDuringLeave,
      documentUrl,
      documentName,
    } = body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    const newLeave = await dataStore.createLeave({
      userId,
      leaveType,
      startDate,
      endDate,
      daysCount: isHalfDay ? 0.5 : (daysCount || 1),
      isHalfDay: !!isHalfDay,
      halfDayType: halfDayType || null,
      reason,
      inchargePerson: inchargePerson || null,
      contactDuringLeave: contactDuringLeave || null,
      documentUrl: documentUrl || null,
      documentName: documentName || null,
    });

    return NextResponse.json({ success: true, data: newLeave }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
