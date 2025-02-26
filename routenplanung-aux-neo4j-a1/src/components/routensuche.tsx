'use client';

import { RoutensucheEingabefeld } from './routensuche-eingabefeld';
import {Card, CardHeader, CardContent} from './ui/card';
import {MoveRight} from 'lucide-react';

export default function Routensuche(){


    return(
        <div>
            <Card>
                <CardHeader>
                    <h1>Routen suchen</h1>
                </CardHeader>
                <CardContent>
                    <p>Willkommen auf der Routensuche</p>
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
        <div className='flex items-center space-x-4'>
            <RoutensucheEingabefeld></RoutensucheEingabefeld>
            <MoveRight className='h-6 w-6 text-gray-500'></MoveRight>
            <RoutensucheEingabefeld></RoutensucheEingabefeld>
        </div>
    );

}


