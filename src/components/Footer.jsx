import Link from "next/link";
import MirrorIcon from "./icons/mirror";
import AiBeautifyIcon from "./icons/ai-beautify";
import WardrobeIcon from "./icons/wardrobe";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full border border-gray-200 bg-white">
      <nav className="grid grid-cols-3">
          <Link href="/match-finder" className='w-full flex justify-center p-4 opacity-50 hover:opacity-100'><MirrorIcon /></Link>
          <Link href="/" className='w-full text-center flex justify-center p-4 opacity-50 hover:opacity-100'><AiBeautifyIcon /></Link>
          <Link href="/inventory" className='w-full text-center flex justify-center p-4 opacity-50 hover:opacity-100'><WardrobeIcon /></Link>
      </nav>
    </footer>
  );
};