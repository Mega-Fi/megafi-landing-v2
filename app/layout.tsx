import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MegaFi | MegaETH Super App",
  description: "Swap, earn, hedge, tokenize, and automate on the fastest chain on Earth",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/megafi-logo.png', sizes: '500x500', type: 'image/png' },
    ],
    apple: '/megafi-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

