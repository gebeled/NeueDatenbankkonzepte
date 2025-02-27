import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function QuestionAnswer() {
  return (
    <div className="px-4 sm:px-6 flex justify-center">
      <Card className="w-full max-w-[1200px]">
        <CardHeader className="pb-2">
          <h1>Q & A:</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center ">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Wo finde ich eine Übersicht über alle Tarife?
              </AccordionTrigger>
              <AccordionContent>
                Eine Übersicht über alle Tarife findest du auf unserer Website.
                Folge dazu folgenden Link:{" "}
                <a
                  href="https://www.avv-augsburg.de/tickets-tarife/ticketuebersicht"
                  className="text-blue-500"
                >
                  https://www.avv-augsburg.de/tickets-tarife/ticketuebersicht
                </a>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Wie bekomme ich eine Schülerkundenkarte?
              </AccordionTrigger>
              <AccordionContent>
                Die Schülerkundenkarte können Sie einfach online bestellen und
                bequem per Post nach Hause schicken lassen. Einfach das Formular
                &quot;Kundenkarte&quot; ausfüllen, aktuelle Bestätigung hochladen und
                absenden. Die Bestellungen werden möglichst direkt, spätestens
                aber am nächsten Arbeitstag bearbeitet und umgehend zur Post
                gebracht. Selbstverständlich stellt Ihnen auch das
                AVV-Kundencenter Ihre Schülerkundenkarte gegen Vorlage einer
                aktuellen Bestätigung der Ausbildungsstätte gerne sofort aus.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Welche Linien schließt diese Routenplanung ein?
              </AccordionTrigger>
              <AccordionContent>
                Diese Routenplanung schließt alle S-Bahn Linien des AVV ein.
                Dazu gehören die Trams, 1,2,3,4,6,9a und 9b.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
