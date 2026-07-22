import React, { useState, useEffect } from 'react';
import { Bookmark, Sparkles, LayoutGrid } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import CollectionsFilter from './components/CollectionsFilter';
import ScrapbookGrid from './components/ScrapbookGrid';
import GiftDetailModal from './components/GiftDetailModal';
import QuizModal from './components/QuizModal';
import SavedScrapbook from './components/SavedScrapbook';
import RecommendationsPage from './components/RecommendationsPage';
import UserStories from './components/UserStories';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { CURATED_CARDS } from './data';
import type { ScrapbookCard, GiftItem, RecommendedGift, QuizAnswers, QuizResponse } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'gallery' | 'saved' | 'results'>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<ScrapbookCard | null>(null);

  // Active recommendations state
  const [activeQuizResults, setActiveQuizResults] = useState<QuizResponse | null>(null);
  const [activeQuizAnswers, setActiveQuizAnswers] = useState<QuizAnswers | null>(null);

  // Local storage lists
  const [savedCardIds, setSavedCardIds] = useState<string[]>([]);
  const [savedItems, setSavedItems] = useState<{ item: GiftItem; cardTitle: string }[]>([]);
  const [savedRecommendedGifts, setSavedRecommendedGifts] = useState<
    { gift: RecommendedGift; answers: QuizAnswers }[]
  >([]);

  // Load from LocalStorage (safe for SSR)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cards = localStorage.getItem('wtg_saved_cards');
        const items = localStorage.getItem('wtg_saved_items');
        const recomms = localStorage.getItem('wtg_saved_recomms');
        const activeRes = localStorage.getItem('wtg_active_quiz_results');
        const activeAns = localStorage.getItem('wtg_active_quiz_answers');

        if (cards) setSavedCardIds(JSON.parse(cards));
        if (items) setSavedItems(JSON.parse(items));
        if (recomms) setSavedRecommendedGifts(JSON.parse(recomms));
        if (activeRes) setActiveQuizResults(JSON.parse(activeRes));
        if (activeAns) setActiveQuizAnswers(JSON.parse(activeAns));
      } catch (err) {
        console.error('Error loading saved items from storage:', err);
      }
    }
  }, []);

  // Sync utilities
  const syncCards = (newIds: string[]) => {
    setSavedCardIds(newIds);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wtg_saved_cards', JSON.stringify(newIds));
    }
  };

  const syncItems = (newItems: { item: GiftItem; cardTitle: string }[]) => {
    setSavedItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wtg_saved_items', JSON.stringify(newItems));
    }
  };

  const syncRecommendedGifts = (
    newRecomms: { gift: RecommendedGift; answers: QuizAnswers }[]
  ) => {
    setSavedRecommendedGifts(newRecomms);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wtg_saved_recomms', JSON.stringify(newRecomms));
    }
  };

  // Quiz completion handler - routes to dedicated page
  const handleCompleteQuiz = (results: QuizResponse, answers: QuizAnswers) => {
    setActiveQuizResults(results);
    setActiveQuizAnswers(answers);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wtg_active_quiz_results', JSON.stringify(results));
      localStorage.setItem('wtg_active_quiz_answers', JSON.stringify(answers));
    }
    setCurrentTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Card pinning handlers
  const handleTogglePinCard = (card: ScrapbookCard, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedCardIds.includes(card.id)) {
      syncCards(savedCardIds.filter((id) => id !== card.id));
    } else {
      syncCards([...savedCardIds, card.id]);
    }
  };

  const handleRemoveCard = (cardId: string) => {
    syncCards(savedCardIds.filter((id) => id !== cardId));
  };

  // Curated gift item saving handlers
  const handleToggleSavedItem = (item: GiftItem, cardTitle: string) => {
    const exists = savedItems.some((si) => si.item.id === item.id);
    if (exists) {
      syncItems(savedItems.filter((si) => si.item.id !== item.id));
    } else {
      syncItems([...savedItems, { item, cardTitle }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    syncItems(savedItems.filter((si) => si.item.id !== itemId));
  };

  // AI Recommended gift pinning handlers
  const handleSaveRecommendedGift = (gift: RecommendedGift, answers: QuizAnswers) => {
    const exists = savedRecommendedGifts.some((rg) => rg.gift.name === gift.name);
    if (exists) {
      syncRecommendedGifts(savedRecommendedGifts.filter((rg) => rg.gift.name !== gift.name));
    } else {
      syncRecommendedGifts([...savedRecommendedGifts, { gift, answers }]);
    }
  };

  const handleRemoveRecommendedGift = (giftName: string) => {
    syncRecommendedGifts(savedRecommendedGifts.filter((rg) => rg.gift.name !== giftName));
  };

  // Category filter computations
  const filteredCards =
    selectedCategory === 'all'
      ? CURATED_CARDS
      : CURATED_CARDS.filter((card) => card.category === selectedCategory);

  const savedCount = savedCardIds.length + savedItems.length + savedRecommendedGifts.length;

  const handleExploreGuides = () => {
    setSelectedCategory('all');
    setCurrentTab('gallery');
    const gridEl = document.getElementById('scrapbook-main-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewStories = () => {
    setCurrentTab('gallery');
    setTimeout(() => {
      const storiesEl = document.getElementById('stories-section');
      if (storiesEl) {
        storiesEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-[#FAF9F6]">
      {/* Fixed Header */}
      <Header
        onStartQuiz={() => setIsQuizOpen(true)}
        onViewSaved={() => setCurrentTab('saved')}
        onViewHome={() => setCurrentTab('gallery')}
        onViewStories={handleViewStories}
        onViewRecommendations={() => setCurrentTab('results')}
        hasRecommendations={!!activeQuizResults}
        savedCount={savedCount}
        currentTab={currentTab}
      />

      <main className="flex-grow pt-28 px-6 pb-24 max-w-[1200px] mx-auto w-full relative">

        {currentTab === 'results' && activeQuizResults && activeQuizAnswers ? (
          <RecommendationsPage
            results={activeQuizResults}
            answers={activeQuizAnswers}
            onRetakeQuiz={() => setIsQuizOpen(true)}
            onBackToGallery={() => setCurrentTab('gallery')}
            onSaveRecommendedGift={handleSaveRecommendedGift}
            savedRecommendedGiftNames={savedRecommendedGifts.map((rg) => rg.gift.name)}
          />
        ) : currentTab === 'saved' ? (
          <SavedScrapbook
            savedCards={CURATED_CARDS.filter((c) => savedCardIds.includes(c.id))}
            savedItems={savedItems}
            savedRecommendedGifts={savedRecommendedGifts}
            onOpenCard={setSelectedCard}
            onRemoveCard={handleRemoveCard}
            onRemoveItem={handleRemoveItem}
            onRemoveRecommendedGift={handleRemoveRecommendedGift}
            onStartQuiz={() => setIsQuizOpen(true)}
          />
        ) : (
          <div className="space-y-20">
            {/* Elegant Hero header */}
            <Hero
              onStartQuiz={() => setIsQuizOpen(true)}
              onExploreGuides={handleExploreGuides}
            />

            {/* Collections & Filter section */}
            <section id="scrapbook-main-section" className="space-y-8 scroll-mt-28">
              <CollectionsFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Asymmetric Board Grid */}
              <ScrapbookGrid
                cards={filteredCards}
                onOpenCard={setSelectedCard}
                onTogglePin={handleTogglePinCard}
                savedIds={savedCardIds}
              />

              {/* Load More guides pagination button */}
              <div className="pt-16 flex justify-center">
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="bg-white border border-black/10 text-[#1A1A1A] px-10 py-4 rounded-none text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-[#FAF9F6] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E2D1C3]" />
                  TAKE FINDER QUIZ FOR UNLIMITED IDEAS
                </button>
              </div>
            </section>

            {/* Real Stories & Experiences Section */}
            <section id="stories-section" className="scroll-mt-28">
              <UserStories />
            </section>
          </div>
        )}

        {/* Modular, high-end CTA */}
        {currentTab !== 'results' && (
          <div className="pt-24">
            <CTA />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Bottom Nav (Mobile Only) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-xl border border-black/15 rounded-none px-6 py-4 flex justify-between items-center z-50 shadow-md">
        <button
          onClick={() => {
            setCurrentTab('gallery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            currentTab === 'gallery' ? 'text-[#1A1A1A]' : 'text-black/40'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Gallery</span>
        </button>

        {activeQuizResults ? (
          <button
            onClick={() => {
              setCurrentTab('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              currentTab === 'results' ? 'text-[#1A1A1A]' : 'text-black/40'
            }`}
          >
            <Sparkles className="w-5 h-5 text-[#1A1A1A]" />
            <span className="text-[10px] font-bold">Matches</span>
          </button>
        ) : (
          <button
            onClick={() => setIsQuizOpen(true)}
            className="flex flex-col items-center gap-1 cursor-pointer text-black/40 hover:text-[#1A1A1A] transition-colors"
          >
            <Sparkles className="w-5 h-5 text-[#1A1A1A]" />
            <span className="text-[10px] font-medium">Quiz</span>
          </button>
        )}

        <button
          onClick={() => setCurrentTab('saved')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${
            currentTab === 'saved' ? 'text-[#1A1A1A]' : 'text-black/40'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-none flex items-center justify-center">
              {savedCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Saved</span>
        </button>
      </nav>

      {/* Modals and Popups */}
      <GiftDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onToggleSavedItem={handleToggleSavedItem}
        savedItemIds={savedItems.map((si) => si.item.id)}
      />

      {isQuizOpen && (
        <QuizModal
          onClose={() => setIsQuizOpen(false)}
          onSaveRecommendedGift={handleSaveRecommendedGift}
          savedRecommendedGiftNames={savedRecommendedGifts.map((rg) => rg.gift.name)}
          onCompleteQuiz={handleCompleteQuiz}
        />
      )}
    </div>
  );
}

