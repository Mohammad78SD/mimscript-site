import "./globals.css";
import type { Metadata } from "next";
import { montserrat, jetbrains } from "@/lib/fonts";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "404 · Page not found",
  robots: { index: false },
};

// Bypasses both root layouts, so it brings its own <html>, fonts and styles.
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={`${montserrat.variable} ${jetbrains.variable}`}>
      <body className="bg-ink text-paper">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <Logo className="mb-10 h-14 w-14 text-blue-light" title="MiM Script" />
          <p className="label text-blue-light">Error 404</p>
          <h1 className="display mt-4 text-[clamp(6rem,28vw,16rem)] font-semibold leading-none">
            404
          </h1>
          <p className="mt-6 text-lg text-paper/80">This page doesn&apos;t exist.</p>
          <p className="label mt-10 flex gap-6">
            <Link href="/" className="underline underline-offset-4 hover:text-blue-light">
              Back to home
            </Link>
            <Link href="/fa" className="underline underline-offset-4 hover:text-blue-light">
              فارسی
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
