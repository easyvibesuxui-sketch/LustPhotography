import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Bodoni_Moda, Cormorant_Garamond, Italiana, Manrope, Pinyon_Script } from "next/font/google";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import NewsletterModal from "@/components/NewsletterModal";
import FloatingCta from "@/components/FloatingCta";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant" });
const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--font-italiana" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "700", "900"], style: ["normal", "italic"], variable: "--font-bodoni" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon" });
const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-manrope" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });

export const metadata: Metadata = {
  title: "Lust Photography — La Dolce Lussuria",
  description: "AI-generated sensual reels and images with an Italian retro soul. For adults 18+.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0E1A13" };

// Runs before paint so returning visitors never see the age gate flash.
const bootScript = `try{var d=document.documentElement;if(localStorage.getItem('lp-age')==='ok')d.dataset.age='ok';if(localStorage.getItem('lp-veil')==='on')d.dataset.veil='on';}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${italiana.variable} ${bodoni.variable} ${pinyon.variable} ${manrope.variable} ${bebas.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SmoothScroll />
        <div className="grain" aria-hidden />
        <AgeGate />
        <Header />
        <main>{children}</main>
        <Footer />
        <NewsletterModal />
        <FloatingCta />
        <Cursor />
      </body>
    </html>
  );
}
