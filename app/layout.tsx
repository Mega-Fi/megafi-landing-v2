import type { Metadata } from "next";
import { League_Spartan, Jost } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";

const leagueSpartan = League_Spartan({ subsets: ["latin"] });
const jost = Jost({ 
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-jost"
});

export const metadata: Metadata = {
  title: "MegaFi Landing - Next.js with Tubelight Navbar",
  description: "A beautiful Next.js landing page with an animated tubelight navbar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${leagueSpartan.className} ${jost.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

