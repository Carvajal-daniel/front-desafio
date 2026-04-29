"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative py-1 text-sm font-medium transition-colors ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      <span
        className={`absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full bg-blue-600 transition-all duration-200 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  );
}

function MobileNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
        active ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
      }`}
    >
      {children}
      {active && (
        <span className="h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
      )}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <>
    
      <header className="sticky top-0 z-50 hidden border-b border-border bg-white/80 backdrop-blur dark:bg-background/80 sm:block">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/Logo-PontoGOH.svg"
              alt="PontoGo"
              width={74}
              height={74}
              className="h-8 w-auto"
            />
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              beta
            </span>
          </Link>

         
          <nav className="flex items-center gap-8 border-b border-transparent">
            <NavLink href="/" active={pathname === "/"}>
              Bater ponto
            </NavLink>
            <NavLink href="/admin" active={pathname.startsWith("/admin")}>
              Administração
            </NavLink>
          </nav>

        </div>
      </header>

     
      <header className="sticky top-0 z-50 flex items-center justify-center border-b border-border bg-white/90 px-4 py-3 backdrop-blur dark:bg-background/90 sm:hidden">
        <Link href="/">
          <Image
            src="/Logo-PontoGOH.svg"
            alt="PontoGo"
            width={74}
            height={74}
            className="h-7 w-auto"
          />
        </Link>
      </header>

     
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-white/95 backdrop-blur dark:bg-background/95 sm:hidden">
        <MobileNavLink href="/" active={pathname === "/"}>
          Bater ponto
        </MobileNavLink>
        <MobileNavLink href="/admin" active={pathname.startsWith("/admin")}>
          Administração
        </MobileNavLink>
      </nav>

      {/* Espaço para o bottom nav não cobrir conteúdo */}
      <div className="h-14 sm:hidden" />
    </>
  );
}