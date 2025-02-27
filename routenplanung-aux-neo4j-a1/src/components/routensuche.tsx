"use client";

import  Stationeneingabe  from "../components/routensuche-stationeneingabe";
import  Routenausgabe from "../components/routensuche-routenausgabe";
import { Card, CardHeader, CardContent } from "./ui/card";  
import { Button } from "./ui/button";
import { TrainFront } from "lucide-react";
import { useState } from "react";

export default function Routensuche() {
const [showRouts, setShowRouts] = useState(false);

  return (
    <div className="px-4 sm:px-6 flex justify-center">
      <Card className="w-full max-w-[1200px]">
        <CardHeader className="flex flex-row flex-nowrap justify-start gap-4 w-full">
            <TrainFront className="h-6 w-6 text-blue-500"></TrainFront>
          <h1>Routen suchen</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center ">
          <Stationeneingabe></Stationeneingabe>
        </CardContent>
          <CardContent className="flex justify-end w-full">
            <Button className="w-full sm:w-auto" onClick={() => setShowRouts(true)}>Suche starten</Button>
          </CardContent>
          {showRouts && (
          <CardContent className="border-t border-gray-200 mt-4 pt-4">
          <Routenausgabe></Routenausgabe>
          </CardContent>
          )}
      </Card>
    </div>
  );
}

