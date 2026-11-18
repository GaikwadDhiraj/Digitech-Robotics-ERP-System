import { NextResponse } from "next/server";
import { dataStore } from "@/lib/dataStore";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const compOffs = await dataStore.getCompOffRequests(userId);
    return NextResponse.json({ success: true, data: compOffs });
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
    if (!body.userId || !body.date || !body.reason) {
      return NextResponse.json(
        { success: false, error: "User, Date, and Reason are required to claim Comp Off." },
        { status: 400 }
      );
    }

    const newClaim = await dataStore.createCompOffRequest(body);
    return NextResponse.json({ success: true, data: newClaim }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
