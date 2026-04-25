import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eslteacher.ai"),
  title: {
    default: "ESLteacher.ai — The AI Hub for English Teachers",
    template: "%s — ESLteacher.ai",
  },
  description: "Discover ready-to-use AI prompts, tutorials, and resources for ESL, EFL, and TESOL teachers. Copy a prompt and use it in ChatGPT, Claude, or Gemini instantly.",
  keywords: [
    "ESL prompts", "EFL teacher AI", "TESOL resources", "ChatGPT for teachers",
    "AI classroom prompts", "English teacher AI", "AI in ESL", "AI ELT tools",
    "lesson planning AI", "IELTS prompts", "AI for language teachers",
  ],
  authors: [{ name: "ESLteacher.ai", url: "https://www.eslteacher.ai" }],
  creator: "ESLteacher.ai",
  publisher: "ESLteacher.ai",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.eslteacher.ai",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.eslteacher.ai",
    siteName: "ESLteacher.ai",
    title: "ESLteacher.ai — The AI Hub for English Teachers",
    description: "Ready-to-use AI prompts for ESL teachers. Browse, copy, and use in seconds.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ESLteacher.ai — The AI Hub for English Teachers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESLteacher.ai — The AI Hub for English Teachers",
    description: "Ready-to-use AI prompts for ESL teachers. Browse, copy, and use in seconds.",
    images: ["/logo.png"],
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
