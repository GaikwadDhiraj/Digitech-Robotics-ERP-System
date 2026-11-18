import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!body.status || !["APPROVED", "REJECTED"].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: "Status must be either APPROVED or REJECTED" },
        { status: 400 }
      );
    }

    const updated = await dataStore.updateCompOffStatus(id, {
      status: body.status,
      actionNotes: body.actionNotes,
      actionBy: body.actionBy || "Admin (Dhiraj Gaikwad)",
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Comp Off record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  return PATCH(request, context);
}
