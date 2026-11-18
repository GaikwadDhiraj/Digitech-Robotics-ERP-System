import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const department = await dataStore.getDepartmentById(id);
    if (!department) {
      return NextResponse.json(
        { success: false, error: "Department not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await dataStore.updateDepartment(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Department not found or update failed." },
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

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await dataStore.deleteDepartment(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Department not found or delete failed." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Department deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
