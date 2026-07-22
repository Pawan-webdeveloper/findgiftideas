import React from 'react';
import { X, Bookmark, ExternalLink, BookmarkCheck } from 'lucide-react';
import type { ScrapbookCard, GiftItem } from '../types';

interface GiftDetailModalProps {
  card: ScrapbookCard | null;
  onClose: () => void;
  onToggleSavedItem: (item: GiftItem, cardTitle: string) => void;
  savedItemIds: string[];
}

export default function GiftDetailModal({
  card,
  onClose,
  onToggleSavedItem,
  savedItemIds,
}: GiftDetailModalProps) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] rounded-none w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl relative border border-black/10 flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header bar */}
        <div className="sticky top-0 z-10 bg-[#FAF9F6] border-b border-black/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-[#E2D1C3] text-[#1A1A1A] text-[9px] font-bold uppercase tracking-widest rounded-none">
              {card.picksCount} Picks
            </span>
            <span className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.2em]">
              Curated Edition
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#1A1A1A] hover:bg-black/5 p-2 rounded-none transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Panel */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-grow custom-scrollbar">
          
          {/* Cover Hero Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white p-6 rounded-none border border-black/5">
            <div className="md:col-span-4 h-48 rounded-none overflow-hidden border border-black/5">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover grayscale-[20%]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:col-span-8">
              <h2 className="font-serif text-[28px] md:text-[34px] text-[#1A1A1A] mb-2 font-light italic">
                {card.title}
              </h2>
              <p className="text-[#1A1A1A]/70 text-sm leading-relaxed mb-4">
                {card.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-black/5 text-[#1A1A1A] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* List of curated items */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-black/5 pb-2">
              Curated Selection
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {card.items.map((item) => {
                const isSaved = savedItemIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-none border border-black/5 flex flex-col justify-between relative group hover:border-black/25 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-serif text-[18px] text-[#1A1A1A] font-bold leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-[#1A1A1A] font-serif font-bold text-[18px] whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-[#1A1A1A]/70 text-[13px] leading-relaxed mb-4 font-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 border-t border-black/5 pt-4 mt-auto">
                      <button
                        onClick={() => onToggleSavedItem(item, card.title)}
                        className={`flex-grow flex items-center justify-center gap-2 py-2 px-3 rounded-none text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                            : 'border-black/10 text-[#1A1A1A] hover:bg-black/5'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            Pinned to Scrapbook
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            Pin to My Scrapbook
                          </>
                        )}
                      </button>
                      
                      <a
                        href={item.link}
                        className="p-2 border border-black/10 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-none transition-all"
                        title="View Store / Learn More"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
