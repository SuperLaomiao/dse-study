import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

export const metadata: Metadata = {
  title: "DSE Study",
  description: "Family-guided English learning for DSE students with daily loops, review checkpoints, and parent visibility.",
  metadataBase: new URL("https://dsestudy.online"),
  openGraph: {
    title: "DSE Study",
    description:
      "Family-guided English learning for DSE students with daily loops, review checkpoints, and parent visibility.",
    url: "https://dsestudy.online",
    siteName: "DSE Study",
    locale: "en_HK",
    type: "website"
  },
  alternates: {
    canonical: "https://dsestudy.online"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
