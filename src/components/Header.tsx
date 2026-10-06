import Link from "next/link";
import { Logo } from "./Logo";

const nav = [
  { href: "/#work", label: "/Work" },
  { href: "/projects", label: "/Projects" },
  { href: "/#about", label: "/About" },
  { href: "/#contact", label: "/Contact" },
];

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-3"
          aria-label="Mohammad Sabet Daryani — home"
        >
          <Logo className="h-7 w-auto" />
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            Mohammad Sabet Daryani
          </span>
        </Link>
        <nav aria-label="Main" className="pointer-events-auto">
          <ul className="label flex gap-4 sm:gap-7">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:underline underline-offset-4">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
