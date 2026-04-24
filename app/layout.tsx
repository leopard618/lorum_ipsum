import type { Metadata } from "next";
import { Poppins, Press_Start_2P } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lorum Ipsum — Software",
  description: "Software landing page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${pressStart2P.variable}`}
    >
      <body className="bg-black font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
