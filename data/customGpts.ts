import { CustomGpt } from "@/types";

// Local fallback — used when Airtable is not configured or the table is empty
// Add your real Custom GPTs in Airtable; this file is the safety net
export const customGpts: CustomGpt[] = [
  {
    id: "c1",
    title: "Prepositions Use Trainer",
    preview: "Train your advanced knowledge of English prepositions with targeted practice and instant feedback.",
    customGptUrl: "https://chatgpt.com/g/g-example-prepositions",
    category: "Vocabulary",
    level: "B2-C1",
  },
];
