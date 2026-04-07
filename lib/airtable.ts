import { PromptCard, TutorialCard, NewsCard, Banner, CustomGpt } from "@/types";
import { prompts as localPrompts } from "@/data/prompts";
import { tutorials as localTutorials } from "@/data/tutorials";
import { news as localNews } from "@/data/news";
import { banners as localBanners } from "@/data/banners";
import { customGpts as localCustomGpts } from "@/data/customGpts";

const BASE_URL = "https://api.airtable.com/v0";

function isConfigured(): boolean {
  return !!(process.env.AIRTABLE_PAT && process.env.AIRTABLE_BASE_ID);
}

// Fetches all records from a table, handling Airtable's 100-record page limit
async function fetchAllRecords(tableName: string): Promise<Record<string, unknown>[]> {
  const pat = process.env.AIRTABLE_PAT!;
  const baseId = process.env.AIRTABLE_BASE_ID!;
  const allRecords: Record<string, unknown>[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`${BASE_URL}/${baseId}/${encodeURIComponent(tableName)}`);
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${pat}` },
      next: { revalidate: 60 }, // Re-fetch from Airtable every 60 seconds
    });

    if (!res.ok) {
      throw new Error(
        `Airtable fetch failed for "${tableName}": ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

function mapPrompt(record: Record<string, unknown>): PromptCard {
  // Supports both the exact Airtable field names the user created (Title, Preview, etc.)
  // and the original camelCase fallback names — whichever is present wins.
  const f = record.fields as Record<string, unknown>;
  const g = (key: string, fallback: string) =>
    f[key] !== undefined ? f[key] : f[fallback];

  const variationsRaw = g("Variations", "variations");
  const tagsRaw = g("Tags", "tags");
  const worksWithRaw = g("WorksWith", "worksWith");

  return {
    id: String(f.id ?? record.id ?? ""),
    airtableId: String(record.id ?? ""),   // always store Airtable's rec... ID for API updates
    title: String(g("Title", "title") ?? ""),
    preview: String(g("Preview", "preview") ?? ""),
    fullPrompt: String(
      f["fullPrompt"] ?? f["Full Prompt"] ?? f["FullPrompt"] ?? f["Prompt"] ?? f["prompt"] ?? f["Full prompt"] ?? ""
    ),
    category: String(g("Category", "category") ?? ""),
    level: String(g("Level", "level") ?? ""),
    time: String(g("Time", "time") ?? ""),
    tags: Array.isArray(tagsRaw) ? (tagsRaw as string[]) : [],
    likes: typeof g("Likes", "likes") === "number" ? (g("Likes", "likes") as number) : 0,
    exampleOutput: String(
      f["ExampleOutput"] ?? f["exampleOutput"] ?? f["Example Output"] ?? f["Example output"] ?? ""
    ),
    classroomUse: String(
      f["ClassroomUse"] ?? f["classroomUse"] ?? f["Classroom Use"] ?? f["Classroom use"] ?? f["How to use"] ?? ""
    ),
    variations:
      typeof variationsRaw === "string" && (variationsRaw as string).trim()
        ? (variationsRaw as string).split(/\r?\n/).filter((v) => v.trim() !== "")
        : undefined,
    worksWith: Array.isArray(worksWithRaw)
      ? (worksWithRaw as PromptCard["worksWith"])
      : [],
    thumbnail: typeof g("Thumbnail", "thumbnail") === "string"
      ? String(g("Thumbnail", "thumbnail"))
      : undefined,
  };
}

export async function getPrompts(): Promise<PromptCard[]> {
  if (!isConfigured()) return localPrompts;
  try {
    const records = await fetchAllRecords("Prompts");
    return records.map(mapPrompt);
  } catch (err) {
    console.error("[Airtable] getPrompts failed — using local data:", err);
    return localPrompts;
  }
}

// ─── Tutorials ────────────────────────────────────────────────────────────────

function mapTutorial(record: Record<string, unknown>): TutorialCard {
  const f = record.fields as Record<string, unknown>;
  const g = (key: string, fallback: string) =>
    f[key] !== undefined ? f[key] : f[fallback];

  // PromptIds: stored as comma-separated text "p1,p3"
  const promptIdsRaw = g("PromptIds", "promptIds");
  const promptIds =
    typeof promptIdsRaw === "string" && promptIdsRaw.trim()
      ? promptIdsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

  // Resources: each line is "Title | URL | FileType"
  const resourcesRaw = g("Resources", "resources");
  const resources =
    typeof resourcesRaw === "string" && resourcesRaw.trim()
      ? resourcesRaw
          .split(/\r?\n/)
          .filter((l) => l.trim())
          .map((line) => {
            const [title, url, fileType] = line.split("|").map((s) => s.trim());
            return { title: title ?? "", url: url ?? "#", fileType };
          })
      : undefined;

  const body = g("Body", "body");
  const videoUrl = g("VideoUrl", "videoUrl");

  // Title — try all naming variants used in Airtable
  const titleRaw =
    f["Title"] ?? f["title"] ?? f["Video_title"] ?? f["video_title"] ??
    f["VideoTitle"] ?? f["video title"] ?? f["Video Title"] ?? "";

  // Description — try dedicated field first, then fall back to first sentence of Body
  const bodyStr = typeof body === "string" ? body.trim() : "";
  const descriptionRaw =
    f["Description"] ?? f["description"] ?? f["Excerpt"] ?? f["excerpt"] ?? "";
  const description =
    typeof descriptionRaw === "string" && descriptionRaw.trim()
      ? descriptionRaw.trim()
      : bodyStr
        ? bodyStr.split(/[.\n]/)[0].trim().slice(0, 160)
        : "";

  return {
    id: String(f.id ?? record.id ?? ""),
    title: String(titleRaw),
    thumbnail: String(g("Thumbnail", "thumbnail") ?? ""),
    duration: String(g("Duration", "duration") ?? ""),
    description,
    videoUrl: typeof videoUrl === "string" && videoUrl.trim() ? videoUrl : undefined,
    body: bodyStr || undefined,
    promptIds,
    resources,
  };
}

export async function getTutorials(): Promise<TutorialCard[]> {
  if (!isConfigured()) return localTutorials;
  try {
    const records = await fetchAllRecords("Tutorials");
    return records.map(mapTutorial);
  } catch (err) {
    console.error("[Airtable] getTutorials failed — using local data:", err);
    return localTutorials;
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────

function mapNews(record: Record<string, unknown>): NewsCard {
  const f = record.fields as Record<string, unknown>;
  const g = (key: string, fallback: string) =>
    f[key] !== undefined ? f[key] : f[fallback];
  // Supports "FullArticle" (what the user named it) and "Body" as fallbacks
  const bodyRaw = f["FullArticle"] ?? f["Body"] ?? f["body"];
  const coverImage = g("CoverImage", "coverImage");
  const author = g("Author", "author");
  return {
    id: String(f.id ?? record.id ?? ""),
    title: String(g("Title", "title") ?? ""),
    excerpt: String(g("Excerpt", "excerpt") ?? ""),
    category: (g("Category", "category") ?? "news") as NewsCard["category"],
    date: String(g("Date", "date") ?? ""),
    author: typeof author === "string" && author.trim() ? author : undefined,
    coverImage: typeof coverImage === "string" && coverImage.trim() ? coverImage : undefined,
    body: typeof bodyRaw === "string" && bodyRaw.trim() ? bodyRaw : undefined,
  };
}

export async function getNews(): Promise<NewsCard[]> {
  if (!isConfigured()) return localNews;
  try {
    const records = await fetchAllRecords("News");
    return records.map(mapNews);
  } catch (err) {
    console.error("[Airtable] getNews failed — using local data:", err);
    return localNews;
  }
}

// ─── Banners ──────────────────────────────────────────────────────────────────

function mapBanner(record: Record<string, unknown>): Banner {
  const f = record.fields as Record<string, unknown>;
  const g = (key: string, fallback: string) =>
    f[key] !== undefined ? f[key] : f[fallback];
  const bgImage = g("BackgroundImage", "backgroundImage");
  const promptId = g("PromptId", "promptId");
  return {
    id: String(f.id ?? record.id ?? ""),
    tag: String(g("Tag", "tag") ?? ""),
    tagColor: String(g("TagColor", "tagColor") ?? ""),
    title: String(g("Title", "title") ?? ""),
    description: String(g("Description", "description") ?? ""),
    ctaText: String(g("CtaText", "ctaText") ?? ""),
    ctaUrl: String(g("CtaUrl", "ctaUrl") ?? ""),
    gradient: String(g("Gradient", "gradient") ?? ""),
    emoji: String(g("Emoji", "emoji") ?? ""),
    backgroundImage: typeof bgImage === "string" && bgImage.trim() ? bgImage : undefined,
    promptId: typeof promptId === "string" && promptId.trim() ? promptId : undefined,
  };
}

export async function getBanners(): Promise<Banner[]> {
  if (!isConfigured()) return localBanners;
  try {
    const records = await fetchAllRecords("Banners");
    // Fall back to local banners if the Airtable table is empty
    if (records.length === 0) return localBanners;
    return records.map(mapBanner);
  } catch (err) {
    console.error("[Airtable] getBanners failed — using local data:", err);
    return localBanners;
  }
}

// ─── Custom GPTs ──────────────────────────────────────────────────────────────

function mapCustomGpt(record: Record<string, unknown>): CustomGpt {
  const f = record.fields as Record<string, unknown>;
  const g = (key: string, fallback: string) =>
    f[key] !== undefined ? f[key] : f[fallback];

  // Categories may be a single-select (string) or multi-select (array)
  const catRaw = g("Categories", "category");
  const category = Array.isArray(catRaw)
    ? (catRaw as string[]).join(", ")
    : String(catRaw ?? "");

  const thumbnail = g("Thumbnail", "thumbnail");

  return {
    id: String(f.id ?? record.id ?? ""),
    title: String(g("Title", "title") ?? ""),
    preview: String(g("Preview", "preview") ?? ""),
    customGptUrl: String(g("CustomGPT", "customGptUrl") ?? ""),
    category,
    level: String(g("Level", "level") ?? ""),
    thumbnail: typeof thumbnail === "string" && thumbnail.trim() ? thumbnail : undefined,
  };
}

export async function getCustomGpts(): Promise<CustomGpt[]> {
  if (!isConfigured()) return localCustomGpts;
  try {
    const records = await fetchAllRecords("Custom GPTs");
    if (records.length === 0) return localCustomGpts;
    // Filter out blank rows (no title means the row was accidentally left empty)
    return records.map(mapCustomGpt).filter((g) => g.title.trim() !== "");
  } catch (err) {
    console.error("[Airtable] getCustomGpts failed — using local data:", err);
    return localCustomGpts;
  }
}
