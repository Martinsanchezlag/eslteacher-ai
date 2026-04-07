// Server Component — fetches prompts and passes to the client PromptsPage
import { getPrompts } from "@/lib/airtable";
import PromptsPage from "@/components/PromptsPage";

export const metadata = {
  title: "All Prompts — ESLteacher.ai",
  description: "Browse the full library of AI prompts for English language teachers. Filter by category, level, and topic.",
};

export default async function Page() {
  const prompts = await getPrompts();
  return <PromptsPage prompts={prompts} />;
}
