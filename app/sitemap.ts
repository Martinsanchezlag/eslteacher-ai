import { MetadataRoute } from "next";
import { getPrompts, getTutorials, getNews } from "@/lib/airtable";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.eslteacher.ai";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${base}/prompts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/tutorials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/ai-in-elt`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic tutorial pages
  let tutorialPages: MetadataRoute.Sitemap = [];
  try {
    const tutorials = await getTutorials();
    tutorialPages = tutorials.map((t) => ({
      url: `${base}/tutorials/${t.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // fallback: no dynamic tutorial URLs
  }

  // Dynamic news/article pages
  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const news = await getNews();
    newsPages = news.map((n) => ({
      url: `${base}/ai-in-elt/${n.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch {
    // fallback: no dynamic news URLs
  }

  return [...staticPages, ...tutorialPages, ...newsPages];
}
