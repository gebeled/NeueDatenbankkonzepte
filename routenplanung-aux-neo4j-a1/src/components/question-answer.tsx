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
              <AccordionTrigger>Wo finde ich eine Übersicht über alle Tarife?</AccordionTrigger>
              <AccordionContent>
                Eine Übersicht über alle Tarife findest du auf unserer Website. Folge dazu folgenden Link: <a href="https://www.avv-augsburg.de/tickets-tarife/ticketuebersicht" className="text-blue-500">https://www.avv-augsburg.de/tickets-tarife/ticketuebersicht</a>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if
                you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
