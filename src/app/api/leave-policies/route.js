import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function GET() {
  try {
    const policies = await dataStore.getLeavePolicies();
    return NextResponse.json({ success: true, data: policies });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.defaultDaysPerYear) {
      return NextResponse.json(
        { success: false, error: "Policy name and default days per year are required." },
        { status: 400 }
      );
    }
    const newPolicy = await dataStore.addLeavePolicy(body);
    return NextResponse.json({ success: true, data: newPolicy }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
