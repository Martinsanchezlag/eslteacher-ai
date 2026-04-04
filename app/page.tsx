// Server Component — fetches all data in parallel, passes to client HomePage
import { getPrompts, getTutorials, getNews, getBanners, getCustomGpts } from "@/lib/airtable";
import HomePage from "@/components/HomePage";

export default async function Page() {
  const [prompts, tutorials, news, banners, customGpts] = await Promise.all([
    getPrompts(),
    getTutorials(),
    getNews(),
    getBanners(),
    getCustomGpts(),
  ]);

  return (
    <HomePage
      prompts={prompts}
      tutorials={tutorials}
      news={news}
      banners={banners}
      customGpts={customGpts}
    />
  );
}
