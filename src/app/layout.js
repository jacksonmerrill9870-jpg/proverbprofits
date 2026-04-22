import { Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Proverbs Profits - Earn With God",
  description: "A simple 60 second WiFi trick that brings faith and purpose to your daily routine.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        {children}
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />
      </body>
    </html>
  );
}
