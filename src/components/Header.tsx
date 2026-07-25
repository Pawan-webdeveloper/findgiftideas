import React from 'react';
import { Sparkles, Bookmark } from 'lucide-react';

interface HeaderProps {
  onStartQuiz: () => void;
  onViewSaved: () => void;
  onViewHome: () => void;
  onViewStories?: () => void;
  onViewRecommendations?: () => void;
  hasRecommendations?: boolean;
  savedCount: number;
  currentTab: 'gallery' | 'saved' | 'results';
}

export default function Header({
  onStartQuiz,
  onViewSaved,
  onViewHome,
  onViewStories,
  onViewRecommendations,
  hasRecommendations,
  savedCount,
  currentTab,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-xl border-b border-black/5 px-8 md:px-12 py-5 flex items-center justify-between shadow-[rgba(0,0,0,0.02)_0px_2px_4px_0px]">
      <div className="flex items-center gap-8">
        <button
          onClick={onViewHome}
          className="font-serif text-3xl font-light italic text-[#1A1A1A] tracking-tight hover:opacity-70 transition-all cursor-pointer"
          id="nav-logo"
        >
          Giftideasfor
        </button>
        <span className="hidden lg:inline-block h-px w-8 bg-black/10"></span>
        <nav className="hidden md:flex gap-8 items-center">
          <button
            onClick={onViewHome}
            className={`text-[10px] font-bold uppercase tracking-widest transition-all hover:text-black/50 cursor-pointer ${
              currentTab === 'gallery'
                ? 'text-[#1A1A1A] underline decoration-black decoration-1 underline-offset-8'
                : 'text-black/60'
            }`}
          >
            Gallery
          </button>

          {onViewStories && (
            <button
              onClick={onViewStories}
              className="text-[10px] font-bold uppercase tracking-widest transition-all text-black/60 hover:text-black/50 cursor-pointer"
            >
              Real Stories
            </button>
          )}

          {hasRecommendations && onViewRecommendations && (
            <button
              onClick={onViewRecommendations}
              className={`text-[10px] font-bold uppercase tracking-widest transition-all hover:text-black/50 cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'results'
                  ? 'text-[#1A1A1A] underline decoration-black decoration-1 underline-offset-8'
                  : 'text-black/60'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#1A1A1A]" />
              My Recommendations
            </button>
          )}

          <button
            onClick={onViewSaved}
            className={`text-[10px] font-bold uppercase tracking-widest transition-all hover:text-black/50 cursor-pointer relative flex items-center gap-2 ${
              currentTab === 'saved'
                ? 'text-[#1A1A1A] underline decoration-black decoration-1 underline-offset-8'
                : 'text-black/60'
            }`}
          >
            My Scrapbook
            {savedCount > 0 && (
              <span className="bg-[#1A1A1A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-none">
                {savedCount}
              </span>
            )}
          </button>

          <a
            href="/about"
            className="text-[10px] font-bold uppercase tracking-widest transition-all text-black/60 hover:text-black/50 no-underline"
          >
            About
          </a>
          <a
            href="/privacy"
            className="text-[10px] font-bold uppercase tracking-widest transition-all text-black/60 hover:text-black/50 no-underline"
          >
            Privacy
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onViewSaved}
          className="md:hidden flex items-center justify-center p-2 text-black/60 hover:text-[#1A1A1A] relative"
          title="View Saved Scrapbook"
        >
          <Bookmark className="w-5 h-5" />
          {savedCount > 0 && (
            <span className="absolute top-1 right-1 bg-[#1A1A1A] text-white text-[8px] font-bold w-4 h-4 rounded-none flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>
        <button
          onClick={onStartQuiz}
          className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-none text-[10px] font-bold tracking-widest uppercase hover:bg-black/85 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          id="btn-start-quiz-nav"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E2D1C3]" />
          START QUIZ
        </button>
      </div>
    </header>
  );
}

