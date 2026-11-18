import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await dataStore.updateLeavePolicy(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Leave policy not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await dataStore.deleteLeavePolicy(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Leave policy not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Leave policy deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
