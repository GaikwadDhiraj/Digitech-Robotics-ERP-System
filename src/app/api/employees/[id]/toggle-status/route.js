import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const updated = await dataStore.toggleEmployeeStatus(id);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
