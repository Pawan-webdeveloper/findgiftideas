import React from 'react';
import { Bookmark, Trash2, ArrowUpRight, Sparkles, AlertCircle } from 'lucide-react';
import type { ScrapbookCard, GiftItem, RecommendedGift, QuizAnswers } from '../types';

interface SavedScrapbookProps {
  savedCards: ScrapbookCard[];
  savedItems: { item: GiftItem; cardTitle: string }[];
  savedRecommendedGifts: { gift: RecommendedGift; answers: QuizAnswers }[];
  onOpenCard: (card: ScrapbookCard) => void;
  onRemoveCard: (cardId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onRemoveRecommendedGift: (giftName: string) => void;
  onStartQuiz: () => void;
}

export default function SavedScrapbook({
  savedCards,
  savedItems,
  savedRecommendedGifts,
  onOpenCard,
  onRemoveCard,
  onRemoveItem,
  onRemoveRecommendedGift,
  onStartQuiz,
}: SavedScrapbookProps) {
  const hasSavedContent =
    savedCards.length > 0 ||
    savedItems.length > 0 ||
    savedRecommendedGifts.length > 0;

  return (
    <section className="space-y-12 pb-16 animate-in fade-in duration-500">
      
      {/* Title block */}
      <div className="border-b border-black/5 pb-6">
        <h2 className="font-serif text-[38px] md:text-[44px] text-[#1A1A1A] leading-tight font-light italic">
          My Scrapbook
        </h2>
        <p className="text-black/60 text-sm font-normal mt-1">
          Your personal curation of pinned gift guides and AI recommended matches.
        </p>
      </div>

      {!hasSavedContent ? (
        <div className="bg-white border border-black/5 rounded-none p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-black/5 rounded-none flex items-center justify-center mx-auto text-[#1A1A1A]">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-light italic text-[#1A1A1A]">
              Your scrapbook is empty
            </h3>
            <p className="text-black/60 text-sm leading-relaxed">
              Explore our curated gift collections on the main board or take our intelligent quiz to let Gemini curate custom recommendations for you to save!
            </p>
          </div>
          <button
            onClick={onStartQuiz}
            className="bg-[#1A1A1A] text-white px-8 py-3 rounded-none text-[10px] uppercase font-bold tracking-widest hover:bg-black/80 transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#E2D1C3]" />
            FIND IDEAS WITH QUIZ
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Section 1: Pinned Guides */}
          {savedCards.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg text-[#1A1A1A] font-bold border-b border-black/5 pb-2">
                Pinned Collection Guides ({savedCards.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => onOpenCard(card)}
                    className="bg-white p-5 rounded-none border border-black/5 flex gap-4 items-center hover:border-black/25 hover:shadow-sm transition-all duration-300 relative group cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-none overflow-hidden shrink-0 border border-black/5">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover grayscale-[20%]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0 pr-8">
                      <h4 className="font-serif font-bold text-[#1A1A1A] text-[17px] truncate">
                        {card.title}
                      </h4>
                      <p className="text-black/60 text-xs mt-1 truncate">
                        {card.description}
                      </p>
                      <span className="inline-block mt-2 text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A] underline decoration-black/25 decoration-1 underline-offset-4">
                        View Guides
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCard(card.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-[#FAF9F6] hover:bg-black/5 text-black/60 hover:text-black rounded-none transition-all cursor-pointer border border-black/5"
                      title="Unpin guide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: AI Recommended Gifts */}
          {savedRecommendedGifts.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg text-[#1A1A1A] font-bold border-b border-black/5 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
                Personalized AI Discoveries ({savedRecommendedGifts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedRecommendedGifts.map(({ gift, answers }) => (
                  <div
                    key={gift.name}
                    className="bg-white p-6 rounded-none border border-black/5 flex flex-col justify-between relative hover:border-black/25 transition-all duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <span className="text-[9px] font-bold bg-[#E2D1C3] text-[#1A1A1A] px-2.5 py-1 rounded-none tracking-widest uppercase block w-fit mb-2">
                            {gift.categoryTag}
                          </span>
                          <h4 className="font-serif text-[18px] font-bold text-[#1A1A1A]">
                            {gift.name}
                          </h4>
                        </div>
                        <span className="text-[#1A1A1A] font-serif font-bold text-[18px] whitespace-nowrap">
                          {gift.priceEstimate}
                        </span>
                      </div>

                      <p className="text-black/70 text-[13px] leading-relaxed mb-4">
                        {gift.description}
                      </p>

                      <div className="bg-black/5 p-3 rounded-none text-[11px] text-black/60 italic mb-4 border border-black/5">
                        <span className="font-bold text-[#1A1A1A] not-italic block mb-0.5">
                          Saved for:
                        </span>
                        A {answers.recipient} as an {answers.occasion} gift ({answers.personality}).
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveRecommendedGift(gift.name)}
                      className="absolute top-4 right-4 p-2 bg-[#FAF9F6] hover:bg-black/5 text-black/60 hover:text-black rounded-none transition-all cursor-pointer border border-black/5"
                      title="Unpin recommended item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Pinned Individual Items */}
          {savedItems.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg text-[#1A1A1A] font-bold border-b border-black/5 pb-2">
                Pinned Curated Items ({savedItems.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedItems.map(({ item, cardTitle }) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-none border border-black/5 flex flex-col justify-between relative hover:border-black/25 transition-all duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#1A1A1A]/40 font-bold block mb-1">
                            From {cardTitle}
                          </span>
                          <h4 className="font-serif text-[17px] font-bold text-[#1A1A1A]">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-[#1A1A1A] font-serif font-bold text-[17px] whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>

                      <p className="text-black/70 text-[12.5px] leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 border-t border-black/5 pt-4 mt-2">
                      <a
                        href={item.link}
                        className="flex-grow flex items-center justify-center gap-2 py-2.5 px-3 rounded-none text-[10px] uppercase tracking-widest font-bold border border-black/10 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6] transition-all"
                      >
                        Buy / Explore Store
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-4 right-4 p-2 bg-[#FAF9F6] hover:bg-black/5 text-black/60 hover:text-black rounded-none transition-all cursor-pointer border border-black/5"
                      title="Unpin item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </section>
  );
}
