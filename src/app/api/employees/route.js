import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";

export async function GET() {
  try {
    const employees = await dataStore.getEmployees();
    return NextResponse.json({ success: true, data: employees });
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
    if (!body.name || !body.email || !body.designation) {
      return NextResponse.json(
        { success: false, error: "Name, email, and designation are required." },
        { status: 400 }
      );
    }
    const newEmployee = await dataStore.createEmployee(body);
    return NextResponse.json({ success: true, data: newEmployee }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
