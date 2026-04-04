export interface PromptCard {
  id: string;
  airtableId?: string;  // Airtable's own record ID (rec...) — used to update likes via API
  title: string;
  preview: string;
  fullPrompt: string;
  category: string;
  level: string;
  time: string;
  tags: string[];
  likes: number;
  exampleOutput: string;
  classroomUse: string;
  variations?: string[];
  worksWith: ("ChatGPT" | "Claude" | "Gemini")[];
  thumbnail?: string; // Optional image URL — if blank, uses category photo
}

export interface TutorialResource {
  title: string;
  url: string;
  fileType?: string; // "PDF", "PPTX", "DOCX", "ZIP"
}

export interface TutorialCard {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  description: string;
  videoUrl?: string;               // YouTube or Vimeo URL
  body?: string;                   // Full notes — paragraphs separated by blank lines
  promptIds?: string[];            // IDs of prompts used in the video (e.g. ["p1","p3"])
  resources?: TutorialResource[];  // Downloadable files
}

export interface NewsCard {
  id: string;
  title: string;
  excerpt: string;
  category: "interview" | "ethics" | "classroom" | "news";
  date: string;
  author?: string;       // Author name
  coverImage?: string;   // Header photo URL
  body?: string;         // Full article text — paragraphs separated by blank lines
}

export interface CustomGpt {
  id: string;
  title: string;
  preview: string;
  customGptUrl: string;  // Link to the custom GPT (e.g. https://chatgpt.com/g/g-...)
  category: string;
  level: string;
  thumbnail?: string;    // Optional photo URL — falls back to category image
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  promptCount: number;
  color: string;
}

export interface TrendingPrompt {
  id: string;
  title: string;
  category: string;
  likes: number;
}

export type FeedItem =
  | { type: "beginner" }
  | { type: "prompt"; data: PromptCard }
  | { type: "tutorial"; data: TutorialCard }
  | { type: "news"; data: NewsCard };

export interface Banner {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;       // URL or a prompt ID like "#p1" to open that prompt
  gradient: string;     // CSS gradient, used as overlay when backgroundImage is set
  emoji: string;
  backgroundImage?: string; // Optional photo URL — overlaid with gradient for readability
  promptId?: string;    // Optional — set to a prompt id (e.g. "p1") to open that prompt on click
}
