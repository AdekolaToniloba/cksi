import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Toast } from "@/components/ui/toast";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalAlertDialog } from "@/components/global-alert-dialog";
import { Providers } from "@/components/providers/session-provider";
import { CookieProvider } from "@/components/cookies/CookieProvider";
import { Navbar } from "@/components/layout/header/navbar";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CookieConsentManager } from "@/components/cookies/cookieConsentManager";

const inter = Inter({ subsets: ["latin"] });

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
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <CookieProvider>
            <CookieConsentManager />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                {/* <Header /> */}
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
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
