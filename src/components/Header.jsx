import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex items-center px-4 py-3 bg-white border-b border-secondary/30">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icons/geokaia-logo.png"
          alt="GeoKaia"
          width={36}
          height={36}
          className="rounded-full"
          priority
        />
        <span className="font-bold text-lg text-brand-text">GeoKaia</span>
      </Link>
    </header>
  );
}
