import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import SessionProvider from "@/app/components/SessionProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import WhatsAppFloat from "./components/WhatsAppFloat";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export const metadata: Metadata = {
  title: {
    template: "%s | Sigira Technologies",
    default: "Sigira Technologies",
  },
  description:
    "We build cutting-edge web and mobile applications for businesses and personal.",
  metadataBase: new URL("https://sigira.com/"),

  openGraph: {
    title: "Sigira Technologies",
    description:
      "We build cutting-edge web and mobile applications for businesses and personal.",
    url: "https://sigira.com/",
    siteName: "Sigira Technologies",
    images: [
      {
        url: `https://sigira.com/${"/public/sigira-og.png"}`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sigira Technologies",
    description:
      "We build cutting-edge web and mobile applications for businesses and personal.",
    images: [`https://sigira.com/${"/public/sigira-og.png"}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/public/favicon-16x16.png",
    apple: "/public/apple-touch-icon.png",
  },
  // languages
  alternates: {
    canonical: "https://sigira.com",
    languages: {
      "en-US": "https://sigira.com/en",
      "es-ES": "https://sigira.com/es",
    },
  },
  // Viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Sigira Technologies",
              url: "https://sigira.com",
              logo: `https://sigira.com/${"/public/android-192x192.png"}`,
              sameAs: [
                "https://twitter.com/sigiratech",
                "https://www.linkedin.com/company/sigiratech",
                "https://www.facebook.com/sigiratech",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} dark:bg-gray-900 dark:text-white`}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppFloat />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
