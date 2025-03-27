import { Mail, Phone, MapPin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-blue-500 text-sm">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 px-2 py-2 justify-items-start md:justify-items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-4 h-4">
            <Mail className="w-full h-full text-blue-500" />
          </div>
          <span>kundencenter(at)avv-augsburg.de</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-4 h-4">
            <MapPin className="w-full h-full text-blue-500" />
          </div>
          <span>Halderstraße 29, 86150 Augsburg</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-4 h-4">
            <Phone className="w-full h-full text-blue-500" />
          </div>
          <span>0821/450 446 16</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-4 h-4">
            <Facebook className="w-full h-full text-blue-500" />
          </div>
          <a
            href="https://www.facebook.com/p/AVV-Augsburger-Verkehrs-und-Tarifverbund-GmbH-61550745226947/">
            AVV Augsburg
          </a>
        </div>
      </div>
    </footer>
  );
}
