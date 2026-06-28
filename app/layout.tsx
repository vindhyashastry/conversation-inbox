import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MswProvider } from "@/components/MswProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conversation Inbox",
  description: "Customer support inbox for your website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`}
    >
      
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-yellow-400 selection:text-zinc-950">
        <MswProvider>
          {children}
        </MswProvider>
      </body>
    </html>
  );
}
