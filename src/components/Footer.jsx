import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full border border-gray-200 bg-white">
      <nav className="grid grid-cols-3">
          <Link href="/match-finder"  className='w-full text-center p-4'>Match</Link>
          <Link href="/" className='w-full text-center p-4'>Out</Link>
          <Link href="/inventory" className='w-full text-center p-4'>Inv</Link>
      </nav>
    </footer>
  );
};