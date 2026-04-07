import { Collection, TrendingPrompt } from "@/types";

export const categories = [
  "All",
  "Warmers",
  "Energisers",
  "Speaking",
  "Writing",
  "Reading",
  "Listening",
  "Grammar",
  "Vocabulary",
  "IELTS",
  "PPT Design",
  "Lesson Planning",
  "Assessment",
  "Homework",
];

export const collections: Collection[] = [
  {
    id: "c1",
    title: "Beginner AI Kit",
    description: "10 prompts for teachers just starting out with AI. No experience needed.",
    promptCount: 10,
    color: "#56E1E9",
    category: "All",
  },
  {
    id: "c2",
    title: "IELTS Prep Pack",
    description: "Everything you need to teach Writing, Speaking, Reading and Listening for IELTS.",
    promptCount: 12,
    color: "#BB63FF",
    category: "IELTS",
  },
  {
    id: "c3",
    title: "Writing Boosters",
    description: "Scaffolds, feedback generators, and task designers for every writing type.",
    promptCount: 8,
    color: "#5B56EB",
    category: "Writing",
  },
  {
    id: "c4",
    title: "Grammar Essentials",
    description: "Error correction, conditionals, tense revision, and more — all ready to use.",
    promptCount: 9,
    color: "#112C70",
    category: "Grammar",
  },
];

export const trendingPrompts: TrendingPrompt[] = [
  { id: "p8", title: "Full Lesson Plan Generator", category: "Lesson Planning", likes: 267 },
  { id: "p4", title: "IELTS Speaking Part 2 Cue Card", category: "IELTS", likes: 298 },
  { id: "p16", title: "IELTS Writing Task 2 Outline", category: "IELTS", likes: 234 },
  { id: "p10", title: "Writing Task Feedback Generator", category: "Writing", likes: 203 },
  { id: "p2", title: "Speaking Discussion Questions", category: "Speaking", likes: 189 },
  { id: "p11", title: "Vocabulary Quiz Generator", category: "Vocabulary", likes: 187 },
];
