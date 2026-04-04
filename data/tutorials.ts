import { TutorialCard } from "@/types";

export const tutorials: TutorialCard[] = [
  {
    id: "t1",
    title: "Getting Started with ChatGPT in Your Classroom",
    thumbnail: "",
    duration: "8 min",
    description: "A step-by-step walkthrough for teachers who have never used ChatGPT. Learn how to write your first prompt and get a usable classroom resource in under 3 minutes.",
    videoUrl: "", // Paste your YouTube URL here: https://youtube.com/watch?v=...
    body: `In this tutorial we start from absolute zero — no prior experience needed. You'll create a free ChatGPT account, write your first prompt, and get a complete classroom activity in under three minutes.

We cover the most common mistake beginners make (writing prompts that are too vague) and show exactly how to fix it. By the end of the video you'll have a reusable "starter formula" for any lesson type.

This is the foundation for everything else on ESLteacher.ai. If you're new to AI in the classroom, start here.`,
    promptIds: ["p1", "p2"],
    resources: [
      {
        title: "Beginner Prompt Starter Pack (PDF)",
        url: "#",
        fileType: "PDF",
      },
    ],
  },
  {
    id: "t2",
    title: "How to Write Better Prompts: The TRACE Framework",
    thumbnail: "",
    duration: "6 min",
    description: "Discover the TRACE method (Task, Role, Audience, Context, Examples) for writing AI prompts that give you high-quality, classroom-ready results every time.",
    videoUrl: "",
    body: `Most AI prompts fail not because the AI is bad, but because the instruction is incomplete. TRACE is a five-part framework that ensures your prompts give the AI everything it needs to produce something genuinely useful.

T — Task: what exactly do you want the AI to produce? R — Role: what role should the AI adopt (e.g. "experienced IELTS examiner")? A — Audience: who is this for (e.g. "B1 adult learners in a Business English context")? C — Context: what's the situation or topic? E — Examples: show the AI what good looks like.

In this tutorial we walk through three before/after examples — a grammar exercise, a speaking activity, and a writing feedback prompt — showing how applying TRACE transforms each one from mediocre to classroom-ready.`,
    promptIds: ["p3"],
    resources: [
      {
        title: "TRACE Framework Reference Card (PDF)",
        url: "#",
        fileType: "PDF",
      },
      {
        title: "TRACE Worksheet (DOCX)",
        url: "#",
        fileType: "DOCX",
      },
    ],
  },
  {
    id: "t3",
    title: "Using AI to Plan a Full Week of Lessons",
    thumbnail: "",
    duration: "12 min",
    description: "Watch how one teacher uses Claude to plan 5 connected lessons around a single topic — including vocabulary, grammar, skills work, and assessment — in under 20 minutes.",
    videoUrl: "",
    body: `Planning a coherent week of lessons is one of the most time-consuming things teachers do. In this tutorial we show a real workflow — using Claude — to build five connected lessons around the topic of "the future of work" at B2 level.

We start with a single prompt that generates a week overview, then drill down into each lesson, generating vocabulary lists, grammar focus tasks, reading/listening activities, and a final assessment. The whole process takes under 20 minutes on screen.

Key skills covered: how to maintain context across a long conversation, how to ask for revisions, and how to export and adapt the output for your actual classroom.`,
    promptIds: ["p4", "p5"],
    resources: [
      {
        title: "Weekly Lesson Plan Template (DOCX)",
        url: "#",
        fileType: "DOCX",
      },
    ],
  },
  {
    id: "t4",
    title: "Creating Differentiated Materials with AI",
    thumbnail: "",
    duration: "9 min",
    description: "Learn how to take one activity and use AI to create three versions — for A2, B1, and B2 learners — without starting from scratch each time.",
    videoUrl: "",
    body: `Mixed-ability classes are the norm, not the exception. This tutorial shows a practical system for using AI to differentiate a single task into three levels — typically in under five minutes.

We demonstrate with a reading comprehension activity, a grammar task, and a discussion prompt — each adapted for A2, B1, and B2. You'll also learn how to prompt the AI to explain the changes it made, which is useful when you need to justify differentiation decisions to a department head or examiner.

By the end of this tutorial you'll have a differentiation workflow you can apply to any material you already own.`,
    promptIds: ["p6"],
  },
  {
    id: "t5",
    title: "AI for IELTS Prep: Prompts That Actually Work",
    thumbnail: "",
    duration: "10 min",
    description: "A practical guide for IELTS teachers: how to use AI to generate authentic practice tasks, model answers, and targeted feedback for Writing Task 1, Task 2, and Speaking.",
    videoUrl: "",
    body: `IELTS preparation is one of the areas where AI adds the most value — and where the quality of your prompts matters most. Generic prompts produce generic practice materials. This tutorial teaches you how to generate IELTS-authentic content.

We cover: Writing Task 1 (bar charts, line graphs, process diagrams), Writing Task 2 (argument essays, discussion essays, problem-solution essays), and Speaking Part 2 (cue cards) and Part 3 (discussion questions). For each, we show the prompt structure that produces Band 6–7 model answers and the prompt that produces examiner-style feedback.

You'll also learn how to use AI to generate whole sets of varied practice tasks quickly — useful for intensive IELTS courses.`,
    promptIds: ["p7", "p8"],
    resources: [
      {
        title: "IELTS Prompt Collection (PDF)",
        url: "#",
        fileType: "PDF",
      },
    ],
  },
  {
    id: "t6",
    title: "Giving Students AI Safely: A Teacher's Guide",
    thumbnail: "",
    duration: "7 min",
    description: "How to introduce AI tools to your students responsibly — including what to allow, what to restrict, how to set boundaries, and how to teach students to use AI as a thinking partner, not a shortcut.",
    videoUrl: "",
    body: `Most students are already using AI — often in ways their teachers don't know about. This tutorial gives you a practical framework for bringing AI use into the open, setting clear expectations, and turning it into a genuine learning tool rather than an avoidance strategy.

We cover three things: how to communicate your AI policy to students (and why vague policies create more problems than they solve); how to design tasks that make productive AI use possible while still requiring genuine engagement; and how to teach students basic prompt literacy so they can use these tools effectively.

Includes a discussion activity you can run with your students on their first day using AI tools in class.`,
    promptIds: [],
    resources: [
      {
        title: "Student AI Agreement Template (PDF)",
        url: "#",
        fileType: "PDF",
      },
    ],
  },
];
