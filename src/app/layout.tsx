import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "MacTorrents - Free macOS Apps & Games",
  description: "Download free macOS applications and games through BitTorrent. A platform for distributing open-source and freeware macOS software.",
  keywords: ["macOS", "apps", "games", "torrent", "free", "download", "software"],
  authors: [{ name: "MacTorrents" }],
  creator: "MacTorrents",
  publisher: "MacTorrents",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
