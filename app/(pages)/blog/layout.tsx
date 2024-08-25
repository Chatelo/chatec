import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stay updated with the latest trends in web and mobile development. Our blog features insights, tips, and news from the world of technology.",
  openGraph: {
    title: "blog",
    description:
      "Explore our latest articles on web development, mobile apps, UI/UX design, and cloud solutions. Stay ahead in the tech world with Sigira.",
    url: "https://sigira.com/blog",
    type: "website",
    images: [
      {
        url: "https://sigira.com/android-192x192.png",
        width: 1200,
        height: 630,
        alt: "Sigira Technologies blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "blog",
    description:
      "Dive into expert insights on web and mobile development, design trends, and tech innovations. Expand your knowledge with Sigira's blog.",
    images: ["https://sigira.com/sigira-og.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
