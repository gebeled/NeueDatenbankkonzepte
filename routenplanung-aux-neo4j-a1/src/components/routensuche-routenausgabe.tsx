'use client';

import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";


export default function Routenausgabe(){
    const trams = [
      { name: "Tram 1", duration: 60 },
      { name: "Tram 2", duration: 30 },
      { name: "Tram 3", duration: 90 },
      { name: "Tram 4", duration: 45 },
    ];
  
      // Berechne die Gesamtzeit
      const totalDuration = trams.reduce((sum, tram) => sum + tram.duration, 0);
  
      const [showDetails, setShowDetails] = useState(false);
  
    return(
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-8">
          <span>13:00 - 14-00 Uhr</span>
          <span>|</span>
          <span>Dauer: 1 Stunde</span>
          <span>|</span>
          <span>Umstiege: 1</span>
          </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-4">
        <div className="col-span-7 flex gap-1">
              {trams.map((tram, index) => (
                <Button
                  key={index}
                  // Berechne die Breite relativ zur Dauer
                  style={{ width: `${(tram.duration / totalDuration) * 100}%` }}
                  className="border-[#7ac142] border-2 bg-background text-foreground cursor-default hover:bg-background hover:text-foreground"
                >
                  {tram.name}
                </Button>
              ))}
            </div>
        <Button className="col-span-1" onClick={() => setShowDetails((prev) => !prev)}> 
          {showDetails ? "Details ausblenden" : "Details anzeigen"}
        </Button>
        </div>
        </CardContent>
        {showDetails && (
          <CardContent>
            Detials
            </CardContent>
            )}
      </Card>
    );
  }