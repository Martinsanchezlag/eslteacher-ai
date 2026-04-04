"use client";

import { useState, useEffect } from "react";
import { PromptCard } from "@/types";

interface PromptModalProps {
  prompt: PromptCard | null;
  onClose: () => void;
}

const aiTools = [
  { name: "ChatGPT", color: "bg-green-100 text-green-700 border-green-200", icon: "🤖" },
  { name: "Claude", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "✦" },
  { name: "Gemini", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "◆" },
] as const;

type SentTo = "chatgpt" | "claude" | "gemini" | null;

function sendToAI(fullPrompt: string, tool: NonNullable<SentTo>) {
  navigator.clipboard.writeText(fullPrompt).catch(() => {});
  const urls = {
    chatgpt: "https://chatgpt.com/",
    claude:  "https://claude.ai/new",
    gemini:  "https://gemini.google.com/app",
  };
  window.open(urls[tool], "_blank", "noopener,noreferrer");
}

export default function PromptModal({ prompt, onClose }: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sentTo, setSentTo] = useState<SentTo>(null);

  function handleSendTo(tool: NonNullable<SentTo>) {
    sendToAI(prompt!.fullPrompt, tool);
    setSentTo(tool);
    setTimeout(() => setSentTo(null), 3000);
  }

  useEffect(() => {
    if (prompt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [prompt]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!prompt) return null;

  function handleCopy() {
    navigator.clipboard.writeText(prompt!.fullPrompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-modal flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-4 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {prompt.category}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {prompt.level}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {prompt.time}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{prompt.title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setSaved((v) => !v)}
              className={`p-2 rounded-xl transition-all duration-200 ${saved ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-400 hover:text-accent hover:bg-accent/10"}`}
              title="Save prompt"
            >
              <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Works with */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Works with</p>
            <div className="flex gap-2 flex-wrap">
              {aiTools.map((tool) => (
                <span
                  key={tool.name}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
                    prompt.worksWith.includes(tool.name as "ChatGPT" | "Claude" | "Gemini")
                      ? tool.color
                      : "bg-gray-50 text-gray-300 border-gray-100"
                  }`}
                >
                  <span>{tool.icon}</span>
                  {tool.name}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt text */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prompt</p>
            <div className="relative">
              <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 font-mono leading-relaxed whitespace-pre-wrap break-words">
                {prompt.fullPrompt}
              </pre>
              <button
                onClick={handleCopy}
                className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  copied
                    ? "bg-green-100 text-green-700"
                    : "bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-sm"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy prompt
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example output */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Example output</p>
            <div className="bg-cyan/10 border border-cyan/30 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{prompt.exampleOutput}</p>
            </div>
          </div>

          {/* Classroom use */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">How to use in class</p>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{prompt.classroomUse}</p>
            </div>
          </div>

          {/* Variations */}
          {prompt.variations && prompt.variations.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Variations</p>
              <ul className="space-y-2">
                {prompt.variations.map((v, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 bg-accent/10 text-accent rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
            {prompt.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer — Use prompt actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center mb-3">
            Use this prompt in
          </p>

          {/* Send to ChatGPT */}
          <button
            onClick={() => handleSendTo("chatgpt")}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-[#10a37f] hover:bg-[#0d8a6c] text-white active:scale-[0.98]"
          >
            {/* ChatGPT logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
            </svg>
            {sentTo === "chatgpt" ? "Copied! Paste it in ChatGPT →" : "Send to ChatGPT"}
          </button>

          {/* Send to Claude */}
          <button
            onClick={() => handleSendTo("claude")}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-[#D97757] hover:bg-[#c4613d] text-white active:scale-[0.98]"
          >
            {/* Claude logo mark */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            {sentTo === "claude" ? "Copied! Paste it in Claude →" : "Send to Claude"}
          </button>

          {/* Copy prompt only */}
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
              copied
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied to clipboard!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy prompt only
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
