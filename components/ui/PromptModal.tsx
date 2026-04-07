"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { PromptCard } from "@/types";

interface PromptModalProps {
  prompt: PromptCard | null;
  onClose: () => void;
}

const aiTools = [
  { name: "ChatGPT", color: "bg-green-100 text-green-700 border-green-200", icon: "🤖" },
  { name: "Claude",  color: "bg-orange-100 text-orange-700 border-orange-200", icon: "✦" },
  { name: "Gemini",  color: "bg-blue-100 text-blue-700 border-blue-200", icon: "◆" },
] as const;

type AITool = "chatgpt" | "claude" | "gemini";
type SentTo = AITool | null;

// Maps the worksWith display name → internal key
const TOOL_KEY: Record<string, AITool> = {
  ChatGPT: "chatgpt",
  Claude:  "claude",
  Gemini:  "gemini",
};

const AI_BUTTON: Record<AITool, { label: string; openLabel: string; className: string; icon: React.ReactNode }> = {
  chatgpt: {
    label:      "Copy & use in ChatGPT",
    openLabel:  "Open ChatGPT",
    className:  "bg-[#10a37f] hover:bg-[#0d8a6c] text-white",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    ),
  },
  claude: {
    label:      "Copy & use in Claude",
    openLabel:  "Open Claude",
    className:  "bg-[#D97757] hover:bg-[#c4613d] text-white",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    ),
  },
  gemini: {
    label:      "Copy & use in Gemini",
    openLabel:  "Open Gemini",
    className:  "bg-[#4285F4] hover:bg-[#3574e2] text-white",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.304 14.304 0 0 0 12 12 14.304 14.304 0 0 0-12 12"/>
      </svg>
    ),
  },
};

const VAR_PALETTE = [
  { pill: "bg-rose-500",    input: "bg-rose-50 text-rose-800 border-rose-300 placeholder:text-rose-300 focus:ring-rose-300"   },
  { pill: "bg-emerald-500", input: "bg-emerald-50 text-emerald-800 border-emerald-300 placeholder:text-emerald-300 focus:ring-emerald-300" },
  { pill: "bg-violet-500",  input: "bg-violet-50 text-violet-800 border-violet-300 placeholder:text-violet-300 focus:ring-violet-300"  },
  { pill: "bg-amber-500",   input: "bg-amber-50 text-amber-800 border-amber-300 placeholder:text-amber-300 focus:ring-amber-300"   },
  { pill: "bg-sky-500",     input: "bg-sky-50 text-sky-800 border-sky-300 placeholder:text-sky-300 focus:ring-sky-300"     },
];

function extractVars(text: string): string[] {
  const matches = text.match(/\[([A-Z_a-z0-9 ]+)\]/g) ?? [];
  const unique: string[] = [];
  matches.forEach((m) => {
    const name = m.slice(1, -1);
    if (!unique.includes(name)) unique.push(name);
  });
  return unique;
}

function resolvePrompt(text: string, values: Record<string, string>): string {
  return text.replace(/\[([A-Z_a-z0-9 ]+)\]/g, (match, name) =>
    values[name]?.trim() ? values[name].trim() : match
  );
}

/**
 * Renders prompt text with [VARIABLE] placeholders as inline input fields.
 * Teachers type directly into the prompt — no separate form needed.
 */
function InlinePrompt({
  text,
  vars,
  values,
  onChange,
}: {
  text: string;
  vars: string[];
  values: Record<string, string>;
  onChange: (name: string, val: string) => void;
}) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const match = remaining.match(/\[([A-Z_a-z0-9 ]+)\]/);
    if (!match || match.index === undefined) {
      parts.push(<span key={key++} className="whitespace-pre-wrap">{remaining}</span>);
      break;
    }
    if (match.index > 0) {
      parts.push(<span key={key++} className="whitespace-pre-wrap">{remaining.slice(0, match.index)}</span>);
    }

    const varName = match[1];
    const idx = vars.indexOf(varName);
    const color = VAR_PALETTE[idx % VAR_PALETTE.length];
    const val = values[varName] ?? "";
    // Estimate input width based on placeholder or current value
    const displayLen = Math.max(varName.length + 2, val.length + 1, 8);

    parts.push(
      <input
        key={key++}
        type="text"
        value={val}
        placeholder={varName.toLowerCase()}
        onChange={(e) => onChange(varName, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{ width: `${displayLen}ch` }}
        className={`inline-block align-baseline mx-0.5 px-1.5 py-0 text-sm font-semibold rounded border focus:outline-none focus:ring-2 transition-all ${color.input}`}
      />
    );

    remaining = remaining.slice(match.index + match[0].length);
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 font-mono leading-[2] break-words">
      {parts}
    </div>
  );
}

function copyToClipboard(text: string) {
  // Try modern API first
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.cssText = "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;";
  document.body.appendChild(el);
  el.focus();
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

const AI_URLS: Record<AITool, string> = {
  chatgpt: "https://chatgpt.com/",
  claude:  "https://claude.ai/new",
  gemini:  "https://gemini.google.com/app",
};


export default function PromptModal({ prompt, onClose }: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sentTo, setSentTo] = useState<SentTo>(null);
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  const vars = useMemo(
    () => (prompt ? extractVars(prompt.fullPrompt) : []),
    [prompt]
  );

  useEffect(() => {
    if (prompt) {
      const initial: Record<string, string> = {};
      extractVars(prompt.fullPrompt).forEach((v) => (initial[v] = ""));
      setVarValues(initial);
    }
  }, [prompt]);

  const resolvedPrompt = useMemo(
    () => (prompt ? resolvePrompt(prompt.fullPrompt, varValues) : ""),
    [prompt, varValues]
  );

  const allFilled = vars.length > 0 && vars.every((v) => varValues[v]?.trim());

  useEffect(() => {
    document.body.style.overflow = prompt ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [prompt]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!prompt) return null;

  function handleCopy() {
    copyToClipboard(resolvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Step 1: copy the prompt and show the "now open the app" button
  function handleCopyForTool(tool: AITool) {
    copyToClipboard(resolvedPrompt);
    setSentTo(tool);
  }

  // Step 2: user clicks the "Open ChatGPT" button — separate click = no browser conflict
  function handleOpenTool(tool: AITool) {
    window.open(AI_URLS[tool], "_blank", "noopener,noreferrer");
    setTimeout(() => setSentTo(null), 500);
  }

  function handleVarChange(name: string, val: string) {
    setVarValues((prev) => ({ ...prev, [name]: val }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />

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
            >
              <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button onClick={onClose} className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors">
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
                  <span>{tool.icon}</span>{tool.name}
                </span>
              ))}
            </div>
          </div>

          {/* ── Prompt section ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prompt</p>
                {/* Variable legend pills */}
                {vars.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {vars.map((v, i) => (
                      <span
                        key={v}
                        className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${VAR_PALETTE[i % VAR_PALETTE.length].pill}`}
                      >
                        {v.toLowerCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {vars.length > 0 && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${allFilled ? "text-emerald-600" : "text-amber-500"}`}>
                    {allFilled ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ready!
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Fill in the coloured fields
                      </>
                    )}
                  </span>
                )}
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    copied ? "bg-green-100 text-green-700" : "bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-sm"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Inline editable prompt OR plain text */}
            {vars.length > 0 ? (
              <InlinePrompt
                text={prompt.fullPrompt}
                vars={vars}
                values={varValues}
                onChange={handleVarChange}
              />
            ) : (
              <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 font-mono leading-relaxed whitespace-pre-wrap break-words">
                {prompt.fullPrompt}
              </pre>
            )}
          </div>

          {/* Example output */}
          {prompt.exampleOutput && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Example output</p>
              <div className="bg-cyan/10 border border-cyan/30 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{prompt.exampleOutput}</p>
              </div>
            </div>
          )}

          {/* Classroom use */}
          {prompt.classroomUse && (
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
          )}

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

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">

          {/* ── Step 2: after copying, show "Open [Tool]" button ── */}
          {sentTo && (
            <div className="mb-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-semibold text-emerald-700">Prompt copied!</span>
                <span className="text-xs text-emerald-600">Now open the app and paste.</span>
              </div>
              <button
                onClick={() => handleOpenTool(sentTo)}
                className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
              >
                {AI_BUTTON[sentTo].openLabel}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          )}

          {/* ── Step 1: copy buttons — only show tools from worksWith ── */}
          {!sentTo && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center mb-3">
                Copy &amp; use in
              </p>
              <div className="space-y-2">
                {prompt.worksWith.map((toolName) => {
                  const key = TOOL_KEY[toolName];
                  if (!key) return null;
                  const btn = AI_BUTTON[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleCopyForTool(key)}
                      className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${btn.className}`}
                    >
                      {btn.icon}
                      {btn.label}
                    </button>
                  );
                })}

                {/* Copy only */}
                <button
                  onClick={handleCopy}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                    copied ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  {copied ? (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy prompt only</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
