import Image from 'next/image';
import Link from 'next/link';

export default function Header() {

    return(
        <header className="border-b-2 border-blue-500 flex">
            <Link href="https://www.avv-augsburg.de/" className="inline-block">
        <Image
            src="/avv-logo.webp"
            alt="AVV Logo"
            width={100}
            height={100} 
            priority 
            className="cursor-pointer"
        />
        </Link>
        </header>


    );
}