import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
    },
  ];
}
