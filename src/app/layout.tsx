import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SessionProvider } from "@/components/session-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UR Snippets - Share Code & Screenshots",
  description: "A minimalist platform to share code snippets, notes, and screenshots with your team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
