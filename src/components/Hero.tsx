import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartQuiz: () => void;
  onExploreGuides: () => void;
}

export default function Hero({ onStartQuiz, onExploreGuides }: HeroProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pt-8">
      {/* SEO-optimized hidden heading for search engines */}
      <h1 className="sr-only not-sr-only-focus:not-sr-only">Gift Ideas For Every Relationship and Occasion – Discover Unique Gift Ideas for Women, Men, Best Friends, Boyfriend, Husband, Father, Sister, Brother &amp; More</h1>
      
      <div className="lg:col-span-7 flex flex-col justify-center">
        <div className="mb-6">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A]/40">
            Featured Board — Edition 2026
          </span>
        </div>
        <div className="font-sans text-[54px] md:text-[84px] leading-[0.85] font-black tracking-tighter uppercase mb-6 text-[#1A1A1A]">
          Perfect<br/>Gifting<br/>
          <span className="text-transparent" style={{ WebkitTextStroke: '1px #1A1A1A' }}>
            curated
          </span>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[#1A1A1A]/80 mb-10 font-normal">
          A visual exploration of thoughtful physical objects, handmade artifacts, and customized treasures curated with an uncompromising anti-slop ethic. Pin your favorites or consult our AI stylist.
        </p>
        <div className="flex flex-wrap items-center gap-8">
          <button
            onClick={onStartQuiz}
            className="bg-[#1A1A1A] text-white px-8 py-4 rounded-none text-[10px] uppercase font-bold tracking-widest hover:bg-black/80 transition-all cursor-pointer flex items-center gap-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E2D1C3]" />
            TAKE FINDER QUIZ
          </button>
          <button
            onClick={onExploreGuides}
            className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-8 cursor-pointer text-[#1A1A1A] hover:opacity-50 transition-all flex items-center gap-2"
          >
            EXPLORE GUIDES
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 relative min-h-[500px] flex items-center justify-center pt-8">
        <div className="relative w-full max-w-sm h-[440px]">
          {/* Callout 1: Noir Premium */}
          <div className="absolute top-[0px] right-4 bg-[#1A1A1A] border border-white/10 p-6 rounded-none shadow-lg transform rotate-3 z-30 w-64 hover:translate-y-[-4px] hover:rotate-1 transition-all duration-300">
            <p className="font-serif text-lg italic text-[#FAF9F6] leading-tight">
              "Thoughtful giving, made deeply personal."
            </p>
          </div>

          {/* Callout 2: High Aesthetic Beige */}
          <div className="absolute top-[110px] left-2 bg-[#E2D1C3] border border-black/5 p-6 rounded-none shadow-md transform -rotate-3 z-20 w-64 hover:translate-y-[-4px] hover:rotate-0 transition-all duration-300 text-[#1A1A1A]">
            <p className="font-serif text-lg italic leading-tight font-medium">
              Expertly Curated
            </p>
            <p className="text-[10px] uppercase tracking-wider text-black/60 mt-1.5 font-sans font-bold">
              Only authentic items
            </p>
          </div>

          {/* Callout 3: Noir Premium Alternate */}
          <div className="absolute top-[220px] right-0 bg-[#1A1A1A] border border-white/10 p-6 rounded-none shadow-md transform rotate-2 z-10 w-64 hover:translate-y-[-4px] hover:rotate-0 transition-all duration-300 text-[#FAF9F6]">
            <p className="font-serif text-lg italic leading-tight font-medium">
              Hand-Picked Gems
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#FAF9F6]/60 mt-1.5 font-sans font-bold">
              No generic duplicates
            </p>
          </div>

          {/* Callout 4: High Aesthetic Beige Alternate */}
          <div className="absolute top-[330px] left-1 bg-[#E2D1C3] border border-black/5 p-6 rounded-none shadow-lg transform -rotate-1 z-0 w-64 hover:translate-y-[-4px] transition-all duration-300 text-[#1A1A1A]">
            <p className="font-serif text-lg leading-tight font-light italic">
              Psychology-Backed
            </p>
            <p className="text-[10px] uppercase tracking-wider text-black/60 mt-1.5 font-sans font-bold">
              Designed for true connection
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
