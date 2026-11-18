import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await dataStore.getDepartments();
    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.code) {
      return NextResponse.json(
        { success: false, error: "Department name and code are required." },
        { status: 400 }
      );
    }
    const newDepartment = await dataStore.createDepartment(body);
    return NextResponse.json({ success: true, data: newDepartment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
