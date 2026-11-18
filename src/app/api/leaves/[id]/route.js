import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, actionNotes, actionBy } = body;

    if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status provided. Must be APPROVED, REJECTED, or PENDING." },
        { status: 400 }
      );
    }

    const updatedLeave = await dataStore.updateLeaveStatus(id, {
      status,
      actionNotes,
      actionBy: actionBy || "Admin",
    });

    if (!updatedLeave) {
      return NextResponse.json({ success: false, error: "Leave request not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLeave });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
