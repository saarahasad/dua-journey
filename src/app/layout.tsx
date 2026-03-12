import type { Metadata, Viewport } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import backgroundImage from "@/newborder.svg";

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
          }}
          aria-hidden
        />
        <ToastProvider>
        <div className="flex min-h-screen justify-center pt-2 px-2">
          <div
            className="w-full max-w-md lg:max-w-xl overflow-y-auto rounded-2xl border border-[#b25d82]/25 bg-white p-4 pt-0 shadow-lg"
            style={{ height: "calc(100vh - 80px);  border: 2px solid #b25d82;            " }}
          >
            {children}
          </div>
        </div>
      </ToastProvider>
      </body>
    </html>
  );
}
