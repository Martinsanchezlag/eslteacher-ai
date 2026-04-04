// ─────────────────────────────────────────────────────────────────────────────
// FEATURED BANNERS — edit this file to update what appears on the homepage
// gradient: use CSS gradient syntax e.g. "135deg, #112C70 0%, #5B56EB 100%"
// backgroundImage: optional photo URL — gradient becomes a semi-transparent overlay
// promptId: optional — set to a prompt id (e.g. "p1") to open that prompt on click
// ─────────────────────────────────────────────────────────────────────────────

import { Banner } from "@/types";

export const banners: Banner[] = [
  {
    id: "b1",
    tag: "New video",
    tagColor: "cyan",
    title: "Watch: How to plan a whole unit with AI in 15 minutes",
    description: "A step-by-step tutorial showing how to use Claude to build a full IELTS preparation unit — from learning objectives to final assessment.",
    ctaText: "Watch now",
    ctaUrl: "#",
    gradient: "135deg, #112C70 0%, #5B56EB 100%",
    emoji: "🎬",
    backgroundImage: "https://images.unsplash.com/photo-1690191911501-ec957eb69bc2?q=80&w=1740&auto=format&fit=crop",
  },
  {
    id: "b2",
    tag: "Free resource",
    tagColor: "purple",
    title: "Free download: 30 AI prompts for the writing classroom",
    description: "A curated pack of 30 classroom-tested prompts for teaching writing at A2–C1. Includes scaffolds, feedback generators, and task designers.",
    ctaText: "Get the pack",
    ctaUrl: "#",
    gradient: "135deg, #BB63FF 0%, #5B56EB 100%",
    emoji: "📥",
    backgroundImage: "https://images.unsplash.com/photo-1581726707445-75cbe4efc586?q=80&w=1752&auto=format&fit=crop",
  },
  {
    id: "b3",
    tag: "Community",
    tagColor: "green",
    title: "Submit your own prompt — and get featured on ESLteacher.ai",
    description: "We're now accepting teacher-submitted prompts. Share what works in your classroom and help build the best AI resource for ELT professionals.",
    ctaText: "Submit a prompt",
    ctaUrl: "#",
    gradient: "135deg, #0A2353 0%, #112C70 100%",
    emoji: "✨",
    backgroundImage: "https://images.unsplash.com/photo-1663228848379-f387bc09f5a6?q=80&w=1742&auto=format&fit=crop",
  },
];
