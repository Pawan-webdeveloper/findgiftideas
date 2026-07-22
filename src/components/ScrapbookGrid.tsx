import React from 'react';
import { ArrowUpRight, Bookmark, BookmarkCheck } from 'lucide-react';
import type { ScrapbookCard } from '../types';

interface ScrapbookGridProps {
  cards: ScrapbookCard[];
  onOpenCard: (card: ScrapbookCard) => void;
  onTogglePin: (card: ScrapbookCard, e: React.MouseEvent) => void;
  savedIds: string[];
}

export default function ScrapbookGrid({
  cards,
  onOpenCard,
  onTogglePin,
  savedIds,
}: ScrapbookGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 items-start">
      {cards.map((card, index) => {
        const isSaved = savedIds.includes(card.id);
        
        // Define specific asymmetric styling / offsets based on card index/id to match layout
        let rotationClass = 'hover:rotate-0';
        let spanClass = 'col-span-1';
        let flexLayoutClass = 'flex flex-col';
        let imgHeightClass = 'h-64';

        if (card.id === 'gamers') {
          rotationClass = 'transform -rotate-1 hover:rotate-0';
        } else if (card.id === 'book-lovers') {
          rotationClass = 'transform rotate-2 hover:rotate-0 lg:mt-12';
          imgHeightClass = 'h-80';
        } else if (card.id === 'moms') {
          rotationClass = 'transform -rotate-2 hover:rotate-0 lg:-mt-8';
        } else if (card.id === 'eco-friendly') {
          rotationClass = 'transform rotate-1 hover:rotate-0 lg:-mt-4';
          imgHeightClass = 'h-72';
        } else if (card.id === 'chef') {
          rotationClass = 'transform -rotate-1 hover:rotate-0 lg:col-span-2 lg:mt-8';
          spanClass = 'lg:col-span-2';
          flexLayoutClass = 'flex flex-col md:flex-row gap-8 items-center';
          imgHeightClass = 'w-full md:w-1/2 h-80';
        } else if (card.id === 'coffee-enthusiast') {
          rotationClass = 'transform rotate-1 hover:rotate-0 lg:mt-6';
          imgHeightClass = 'h-80';
        } else if (card.id === 'modern-nomad') {
          rotationClass = 'transform -rotate-1 hover:rotate-0 lg:-mt-4';
          imgHeightClass = 'h-64';
        } else if (card.id === 'backyard-host') {
          rotationClass = 'transform rotate-1 hover:rotate-0 lg:mt-6';
          imgHeightClass = 'h-72';
        } else if (card.id === 'pet-lovers') {
          rotationClass = 'transform rotate-2 hover:rotate-0 lg:-mt-8';
          imgHeightClass = 'h-72';
        } else if (card.id === 'desk-curator') {
          rotationClass = 'transform -rotate-2 hover:rotate-0 lg:mt-6';
          imgHeightClass = 'h-80';
        } else if (card.id === 'wellness-sanctuary') {
          rotationClass = 'transform rotate-1 hover:rotate-0 lg:-mt-4';
          imgHeightClass = 'h-72';
        } else if (card.id === 'plant-parent') {
          rotationClass = 'transform -rotate-1 hover:rotate-0 lg:mt-4';
          imgHeightClass = 'h-80';
        } else if (card.id === 'analog-vault') {
          rotationClass = 'transform rotate-2 hover:rotate-0 lg:-mt-6';
          imgHeightClass = 'h-72';
        } else if (card.id === 'celestial-observatory') {
          rotationClass = 'transform -rotate-1 hover:rotate-0 lg:mt-2';
          imgHeightClass = 'h-80';
        } else if (card.id === 'tea-ceremony') {
          rotationClass = 'transform rotate-1 hover:rotate-0 lg:-mt-4';
          imgHeightClass = 'h-72';
        }

        return (
          <article
            key={card.id}
            onClick={() => onOpenCard(card)}
            className={`group bg-white p-6 rounded-none border border-black/5 shadow-[rgba(0,0,0,0.02)_0px_10px_25px_0px] transition-all duration-500 hover:translate-y-[-8px] cursor-pointer relative ${rotationClass} ${spanClass}`}
          >
            {/* Save bookmark button */}
            <button
              onClick={(e) => onTogglePin(card, e)}
              className="absolute top-8 right-8 z-20 w-10 h-10 bg-[#FAF9F6] border border-black/10 rounded-none flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6] hover:border-transparent transition-all cursor-pointer"
              title={isSaved ? "Remove from scrapbook" : "Pin to scrapbook"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-[#1A1A1A]" />
              ) : (
                <Bookmark className="w-5 h-5 opacity-75" />
              )}
            </button>

            <div className={flexLayoutClass}>
              {/* Card Image */}
              <div className={`${imgHeightClass} rounded-none overflow-hidden mb-6 relative group-hover:scale-[1.01] transition-transform duration-500 border border-black/5`}>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/[0.02] mix-blend-multiply" />
              </div>

              {/* Card Details */}
              <div className={['chef', 'backyard-host'].includes(card.id) ? 'w-full md:w-1/2' : 'w-full'}>
                <div className="flex gap-3 items-center mb-4">
                  <span className="inline-block px-3 py-1 bg-[#E2D1C3] text-[#1A1A1A] text-[9px] font-bold uppercase tracking-widest rounded-none">
                    {card.picksCount} Picks
                  </span>
                  {card.tags.slice(0, 1).map((tag, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/40 font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-serif text-[26px] md:text-[28px] text-[#1A1A1A] mb-3 leading-tight tracking-tight font-light italic group-hover:opacity-75 transition-opacity">
                  {card.title}
                </h3>

                <p className="text-[#1A1A1A]/70 text-[13.5px] leading-relaxed mb-6 font-normal">
                  {card.description}
                </p>

                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] underline underline-offset-8 decoration-black/20 group-hover:decoration-black transition-all">
                  {['chef', 'backyard-host'].includes(card.id) ? 'EXPLORE THIS GUIDE' : 'OPEN SCRAPBOOK'}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
