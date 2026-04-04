"use client";

import Image from "next/image";
import SearchBar from "@/components/ui/SearchBar";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function Header({ searchQuery = "", onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 h-20">
          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="ESLteacher.ai"
              width={220}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </a>

          {/* Search — only shown when handler is provided */}
          {onSearchChange && (
            <div className="flex-1 max-w-xl hidden sm:block">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search prompts, topics, levels…"
              />
            </div>
          )}

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            <a href="#prompts" className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all">
              Prompts
            </a>
            <a href="/tutorials" className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all">
              Tutorials
            </a>
            <a href="/ai-in-elt" className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all">
              AI in ELT
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-sm"
            >
              Get started
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile search — only shown when handler is provided */}
        {onSearchChange && (
          <div className="sm:hidden pb-3">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search prompts…"
            />
          </div>
        )}
      </div>
    </header>
  );
}
