// cksi/app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toast } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalAlertDialog } from "@/components/global-alert-dialog";
import { Providers } from "@/components/providers/session-provider";
import { CookieProvider } from "@/components/cookies/CookieProvider";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CookieConsentManager } from "@/components/cookies/cookieConsentManager";
import { MainLayout } from "@/components/layout/main-layout"; // Import the new component

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CKSI - Couples and Kids Social Initiatives",
  description:
    "Empowering families and children across Nigeria through education, healthcare, and community development programs.",
  keywords: [
    "Nigerian NGO",
    "children",
    "families",
    "education",
    "healthcare",
    "community development",
  ],
  openGraph: {
    title: "CKSI - Couples and Kids Social Initiatives",
    description:
      "Empowering families and children across Nigeria through education, healthcare, and community development programs.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSerif.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-cksi-warm text-cksi-dark antialiased">
        <Providers>
          <CookieProvider>
            <CookieConsentManager />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {/* Replace direct Navbar/Main/Footer with the conditional wrapper */}
              <MainLayout>{children}</MainLayout>

              <GlobalAlertDialog />
              <Toast />
            </ThemeProvider>
          </CookieProvider>

          <Script
            src="https://js.paystack.co/v1/inline.js"
            strategy="beforeInteractive"
          />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        </Providers>
      </body>
    </html>
  );
}
