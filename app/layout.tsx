import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Opinion Machine",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-sm antialiased`}>
        <header>
        </header>

        <main>
          {children}
        </main>

        <footer>
        </footer>
      </body>
    </html>
  );
}
