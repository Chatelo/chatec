import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sigira Technologies for your web and mobile development needs. We're here to answer your questions and discuss your project requirements.ß",
  openGraph: {
    title: "Contact",
    description:
      "Reach out to us for cutting-edge web and mobile solutions. Let's discuss how we can bring your ideas to life.",
    url: "https://sigira.com/contact",
    type: "website",
    images: [
      {
        url: "https://sigira.com/android-192x192.png",
        width: 1200,
        height: 630,
        alt: "Sigira Technologies contact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description:
      "Connect with us for innovative web and mobile solutions. We're ready to help you achieve your digital goals.",
    images: ["https://sigira.com/sigira-og.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
