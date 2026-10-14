import Image from "next/image";
import { cn } from "@/lib/cn";
import logo from "@/public/ayf-logo.png";

/** The official Anglican Youth Fellowship (Nigeria) emblem. */
export default function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={logo}
      alt="Anglican Youth Fellowship (Nigeria) logo"
      sizes="(min-width: 1024px) 320px, 96px"
      priority={priority}
      className={cn("shrink-0 rounded-full", className)}
    />
  );
}
