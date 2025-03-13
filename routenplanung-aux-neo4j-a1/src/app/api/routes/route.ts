import { NextResponse, NextRequest } from "next/server";
import { findRoutes } from "@/lib/queries";


export async function POST(req: NextRequest) {
    try {
      // JSON-Daten aus dem Request-Body lesen
      const body = await req.json();
      const { startStation, endStation, date, time } = body;
  
      // Prüfen, ob alle erforderlichen Parameter vorhanden sind
      if (!startStation || !endStation || !date || !time) {
        return NextResponse.json(
          { error: "Missing required parameters" },
          { status: 400 }
        );
      }
  
      // Routen abrufen
      const routes = await findRoutes(startStation, endStation, date, time);
  
      return NextResponse.json({ routes });
    } catch (error) {
      console.error("Error fetching routes:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }