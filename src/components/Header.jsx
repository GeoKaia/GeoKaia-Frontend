"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

// animarEntrada: solo la home lo pasa en true — el logo no debe "aparecer" cada
// vez que se navega a otra página, este Header se monta en todas.
export default function Header({ animarEntrada = false }) {
  const logoRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!animarEntrada || !logoRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
    return () => tween.kill();
  }, [animarEntrada]);

  return (
    <header className="w-full flex items-center px-4 py-3 bg-white border-b border-secondary/30">
      <Link ref={logoRef} href="/" className="flex items-center gap-2">
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
