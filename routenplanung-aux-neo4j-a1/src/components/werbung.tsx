import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Werbung() {
  const images = [
    "/Werbung1.jpeg",
    "/Werbung2.jpeg",
    "/Werbung3.jpeg",
    "/Werbung4.jpeg",
    "/Werbung5.jpeg",
  ];

  return (
    <div className="px-4 sm:px-6 flex justify-center">
      <Carousel className="w-full max-w-[800px] relative">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                <Image
                  src={src}
                  alt={`Bild ${index + 1}`}
                  //layout="responsive"
                  width={800}
                  height={450} 
                  className="rounded-xl object-contain w-full h-auto"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 z-10 transform -translate-y-1/2 w-6 h-6 md:w-8 md:h-8" />
        <CarouselNext className="absolute right-2 top-1/2 z-10 transform -translate-y-1/2 w-6 h-6 md:w-8 md:h-8" />
      </Carousel>
    </div>
  );
}
