'use client';

import { RoutensucheEingabefeld, RoutensuchePickdate, RoutensuchePicktime } from './routensuche-speziellefelder';
import {Card, CardHeader, CardContent} from './ui/card';
import {Button} from './ui/button';
import {MoveRight} from 'lucide-react';


export default function Routensuche(){


    return(
        <div>
            <Card>
                <CardHeader>
                    <h1>Routen suchen</h1>
                </CardHeader>
                <CardContent className='flex flex-col items-center '>
                    <Stationeneingabe></Stationeneingabe>
                </CardContent>
                <CardContent>
                    <p>Bitte geben Sie Ihre Start- und Zieladresse ein</p>
                </CardContent>
            </Card>
        </div>


    );
}


function Stationeneingabe(){

    return(
        <div className="w-full">
        <div className="grid sm:grid-cols-[1fr_auto] grid-cols-1 gap-4 w-full items-center">
            <div className="flex items-center gap-4 flex-wrap">
            <RoutensucheEingabefeld></RoutensucheEingabefeld>
            <MoveRight className="h-6 w-6 text-gray-500 hidden sm:block"></MoveRight>
            <RoutensucheEingabefeld></RoutensucheEingabefeld>
            </div>
            <div className="flex justify-end w-full">
            <Button className="w-full sm:w-auto">Suche starten</Button>
            </div>
        </div>
        <div className="grid sm:grid-cols-[1fr_auto] grid-cols-1 gap-4 w-full items-center mt-3">
        <div className="flex items-center gap-4 flex-wrap">
            <RoutensuchePickdate></RoutensuchePickdate>
            <RoutensuchePicktime></RoutensuchePicktime>
            </div>
            <div className="flex justify-end w-full">
            <Button variant="outline" className="w-full sm:w-auto">weitere Filteroptionen</Button>
            </div>
        </div>
        </div>
    );
}


