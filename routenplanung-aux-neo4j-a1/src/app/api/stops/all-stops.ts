//zurückgeben aller haltestellen

import { NextResponse } from "next/server";
import { getAllStops } from "@/lib/queries";


export async function GET() {
  try {
    const stops = await getAllStops();
    return NextResponse.json({ stops });
  } catch (error) {
    console.error("Error fetching stops:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}