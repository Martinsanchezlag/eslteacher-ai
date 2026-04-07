"use client";

import { useState } from "react";
import Image from "next/image";
import SearchBar from "@/components/ui/SearchBar";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function Header({ searchQuery = "", onSearchChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16 sm:h-20">

          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="ESLteacher.ai"
              width={220}
              height={60}
              className="h-10 sm:h-14 w-auto"
              priority
            />
          </a>

          {/* Search bar — desktop */}
          {onSearchChange && (
            <div className="flex-1 max-w-xl hidden sm:block">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search prompts, topics, levels…"
              />
            </div>
          )}

          {/* Nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-1 ml-auto">
            <a href="/prompts" className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all">
              Prompts
            </a>
            <a href="/tutorials" className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all">
              Tutorials
            </a>
            <a href="/ai-in-elt" className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all">
              AI in ELT
            </a>
            <a
              href="#"
              className="ml-2 inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-sm"
            >
              Get started
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </nav>

          {/* Hamburger button — mobile/tablet */}
          <button
            className="lg:hidden ml-auto p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile search bar */}
        {onSearchChange && (
          <div className="sm:hidden pb-3">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search prompts…"
            />
          </div>
        )}

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            <a
              href="/prompts"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-primary px-3 py-3 rounded-lg hover:bg-primary/5 transition-all"
            >
              Prompts
            </a>
            <a
              href="/tutorials"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-primary px-3 py-3 rounded-lg hover:bg-primary/5 transition-all"
            >
              Tutorials
            </a>
            <a
              href="/ai-in-elt"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-primary px-3 py-3 rounded-lg hover:bg-primary/5 transition-all"
            >
              AI in ELT
            </a>
            <div className="pt-2 px-3">
              <a
                href="#"
                className="flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-sm w-full"
              >
                Get started
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
