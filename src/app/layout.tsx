import type { Metadata, Viewport } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import backgroundImage from "@/background-1.png";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Indeed, I Am Near | Dua Journey",
  description: "When My servants ask about Me, surely I am near. Memorise duas through guided presentation-style learning.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={amiri.variable}>
      <body className="relative min-h-screen font-sans safe-area-padding">
        <div
          className="fixed inset-0 -z-10 min-h-[100dvh] w-full min-w-full"
          style={{
            backgroundImage: `url(${backgroundImage.src})`,
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            opacity: 1,
          }}
          aria-hidden
        />
        <div
          className="fixed inset-0 -z-10 min-h-[100dvh] w-full min-w-full pointer-events-none"
      
          aria-hidden
        />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
