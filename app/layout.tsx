import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESLteacher.ai — AI Prompts for English Teachers",
  description: "Discover ready-to-use AI prompts, tutorials, and resources for ESL, EFL, and TESOL teachers. Copy a prompt and use it in ChatGPT, Claude, or Gemini instantly.",
  keywords: ["ESL prompts", "EFL teacher AI", "TESOL resources", "ChatGPT teacher", "AI classroom prompts"],
  openGraph: {
    title: "ESLteacher.ai — AI Prompts for English Teachers",
    description: "Ready-to-use AI prompts for ESL teachers. Browse, copy, and use in seconds.",
    siteName: "ESLteacher.ai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
