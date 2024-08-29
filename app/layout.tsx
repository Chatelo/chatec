import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import SessionProvider from "@/app/components/SessionProvider";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";
import "@/app/globals.css";
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
    title: "%s | Sigira Technologies",
    description:
      "We build cutting-edge web and mobile applications for businesses and personal.",
    url: "https://sigira.com/",
    siteName: "Sigira Technologies",
    // images: [
    //   {
    //     url: "https://sigira.com/sigira-og.png",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "%s | Sigira Technologies",
    description:
      "We build cutting-edge web and mobile applications for businesses and personal.",
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
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // languages
  alternates: {
    canonical: "https://sigira.com",
    languages: {
      "en-US": "https://sigira.com/en",
      "es-ES": "https://sigira.com/es",
    },
  },
  authors: [{ name: "Benard Ronoh" }],
  keywords: [
    "web development",
    "mobile development",
    "software development",
    "web design",
    "mobile design",
    "software design",
    "web developer",
    "mobile developer",
    "software developer",
    "web designer",
    "mobile designer",
    "software designer",
    "web developer in kenya",
    "mobile developer in kenya",
    "software developer in kenya",
    "web designer in kenya",
    "mobile designer in kenya",
    "software designer in kenya",
    "web developer in nairobi",
    "mobile developer in nairobi",
    "software developer in nairobi",
    "web designer in nairobi",
    "mobile designer in nairobi",
    "software designer in nairobi",
    "web developer in africa",
    "mobile developer in africa",
    "software developer in africa",
    "web designer in africa",
    "mobile designer in africa",
    "software designer in africa",
    "web developer in the world",
    "mobile developer in the world",
    "software developer in the world",
    "web designer in the world",
    "mobile designer in the world",
    "software designer in the world",
    "web development company",
    "mobile development company",
    "software development company",
    "web design company",
    "mobile design company",
    "software design company",
    "web development company in kenya",
    "mobile development company in kenya",
    "software development company in kenya",
    "web design company in kenya",
    "mobile design company in kenya",
    "software design company in kenya",
    "web development company in nairobi",
    "mobile development company in nairobi",
    "software development company in nairobi",
    "web design company in nairobi",
    "mobile design company in nairobi",
    "software design company in nairobi",
    "web development company in africa",
    "mobile development company in africa",
    "software development company in africa",
    "web design company in africa",
    "mobile design company in africa",
    "software design company in africa",
    "web development company in the world",
    "mobile development company in the world",
    "software development company in the world",
    "web design company in the world",
    "mobile design company in the world",
    "software design company in the world",
  ],
  category: "Software Development",
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
              logo: "https://sigira.com/android-192x192.png",
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
