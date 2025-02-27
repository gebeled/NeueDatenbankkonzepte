'use client';

import QuestionAnswer from "./question-answer";
import Routensuche from "./routensuche";
import Werbung from "./werbung";


export default function Startseite() {

    return(
        <div className="space-y-10">
            <Routensuche></Routensuche>
            <Werbung></Werbung>
            <QuestionAnswer></QuestionAnswer>


        </div>
        //Header mit Logo und bei KLick auf das Logo Link zur richtigen Seite
        // Routensuche
        //Werbung 

    
    );
}