import type { Metadata } from "next";
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
  title: "Dua Journey",
  description: "Memorise duas through guided presentation-style learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={amiri.variable}>
      <body className="relative min-h-screen font-sans">
        <div
          className="fixed inset-0 -z-10 min-h-full w-full"
          style={{
            backgroundImage: `url(${backgroundImage.src})`,
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            opacity: 1,
          }}
          aria-hidden
        />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
