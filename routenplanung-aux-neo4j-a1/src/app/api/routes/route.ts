import { NextResponse, NextRequest } from "next/server";
import { findRoutes } from "@/lib/queries";


export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { startStation, endStation, date, time, fewchanges, wheelchair_boarding, allowedRoutes } = body;
  
      if (!startStation || !endStation || !date || !time || typeof fewchanges !== "boolean" || typeof wheelchair_boarding !== "boolean" || !Array.isArray(allowedRoutes)) {
        return NextResponse.json(
          { error: "Missing required parameters" },
          { status: 400 }
        );
      }

      const routes = await findRoutes(startStation, endStation, date, time, wheelchair_boarding, fewchanges, allowedRoutes);
  
      return NextResponse.json({ routes });
    } catch (error) {
      console.error("Error fetching routes:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }