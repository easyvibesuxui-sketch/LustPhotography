import type { Metadata, Viewport } from "next";
import {
  Anton,
  Barlow_Condensed,
  Bebas_Neue,
  Big_Shoulders,
  Bodoni_Moda,
  Bungee,
  DM_Serif_Display,
  Instrument_Serif,
  Italiana,
  Josefin_Sans,
  Permanent_Marker,
  Pinyon_Script,
  Roboto,
  Shrikhand,
} from "next/font/google";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import NewsletterModal from "@/components/NewsletterModal";
import FloatingCta from "@/components/FloatingCta";

// Editorial type, closer to the reference: serif display + condensed sans UI.
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-dmserif" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow" });
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-roboto" });
// Poster lockup faces — each film title gets its own voice and colour.
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--nf-marker" });
const bungee = Bungee({ subsets: ["latin"], weight: "400", variable: "--nf-bungee" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--nf-anton" });
const shrikhand = Shrikhand({ subsets: ["latin"], weight: "400", variable: "--nf-shrikhand" });
const shoulders = Big_Shoulders({ subsets: ["latin"], weight: ["300", "500"], variable: "--nf-shoulders" });
const josefin = Josefin_Sans({ subsets: ["latin"], weight: ["200", "400"], variable: "--nf-josefin" });
const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--font-italiana" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "700", "900"], style: ["normal", "italic"], variable: "--nf-bodoni" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon" });
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
    <html lang="en" className={[instrument, dmSerif, barlow, roboto, italiana, bodoni, pinyon, bebas, marker, bungee, anton, shrikhand, shoulders, josefin].map((f) => f.variable).join(" ")} suppressHydrationWarning>
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
