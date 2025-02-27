import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative border-b-2 border-blue-500 flex items-center justify-center h-20 space-x-2">
      <Link 
        href="https://www.avv-augsburg.de/" 
        className="inline-block sm:absolute sm:left-4 sm:top-1/2 sm:transform sm:-translate-y-1/2"
      >
        <Image
          src="/avv-logo.webp"
          alt="AVV Logo"
          width={100}
          height={100}
          priority
          className="cursor-pointer sm:scale-100 scale-75"
        />
      </Link>
      <div className="font-bold text-center">
        Routenplanung der S-Bahn Linien in Augsburg
      </div>
    </header>
  );
}
