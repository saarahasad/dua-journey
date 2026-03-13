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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Indeed, I Am Near | Dua Journey",
  description: "When My servants ask about Me, surely I am near. Memorise duas through guided presentation-style learning.",
  icons: {
    icon: `${basePath}/images/small-app-icon.png`,
    apple: `${basePath}/images/small-app-icon.png`,
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=!1;function reload(){if(!r){r=!0;location.reload()}}window.addEventListener("error",function(e){/ChunkLoadError|Loading chunk.*failed/i.test(e.message||"")&&reload()});window.addEventListener("unhandledrejection",function(e){var m=e.reason&&(e.reason.message||String(e.reason));m&&/Loading chunk|ChunkLoadError/i.test(m)&&reload()})})();`,
          }}
        />
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
