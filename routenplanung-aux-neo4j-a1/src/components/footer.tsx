import { Mail, Phone, MapPin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-blue-500 text-sm">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 px-2 py-2 justify-items-start">
        
        <div className="flex items-center gap-1">
          <Mail className="h-4 w-4 text-blue-500" />
          <span>kundencenter(at)avv-augsburg.de</span>
        </div>
        
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span>Halderstraße 29, 86150 Augsburg</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4 text-blue-500" />
          <span>0821/450 446 16</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Instagram className="h-4 w-4 text-blue-500" />
          <span>@avv_augsburg</span>
        </div>
      </div>
    </footer>
  );
}
