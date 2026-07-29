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
import FAQSection from './components/FAQSection';
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

            {/* SEO Content Section – 600+ words about the tool */}
            <article className="max-w-4xl mx-auto py-16 border-t border-black/5" aria-label="About GiftIdeaFor – Your Gift Discovery Tool">
              <div className="space-y-6 text-[15px] leading-8 text-[#1A1A1A]/80">
                <h2 className="font-serif text-3xl md:text-4xl font-light italic text-[#1A1A1A] mb-8">
                  Discover Thoughtful and Memorable Gift Ideas for Every Relationship and Occasion
                </h2>
                
                <p>
                  <strong>GiftIdeaFor</strong> is a modern gift discovery platform created to make choosing the perfect present feel simple, inspiring, and deeply personal. Instead of spending hours scrolling through endless generic products, our tool helps you explore curated suggestions intelligently designed around real relationships, personalities, and meaningful occasions. Whether you're searching for <strong>gift ideas for women</strong>, <strong>gift ideas for girls</strong>, <strong>unique gift ideas for women</strong>, or <strong>unique gift ideas for men</strong>, our experience transforms what is often a stressful shopping task into a joyful, guided journey.
                </p>

                <p>
                  We understand that finding the right gift is about more than just picking a product. It is about understanding the person you are shopping for. That is why our platform offers a comprehensive approach to gift discovery, helping you find <strong>gift ideas for men</strong> who appreciate practicality, <strong>gift ideas for best friend</strong> who values sentimentality, and <strong>gift ideas for boyfriend</strong> who deserves something genuinely thoughtful. Our curated collections span across all relationship types and budgets, making it easy to discover presents that feel intentional rather than rushed.
                </p>

                <h3 className="font-serif text-2xl font-light italic text-[#1A1A1A] mt-10 mb-4">
                  The Perfect Gift for Every Person in Your Life
                </h3>

                <p>
                  Our platform is especially valuable for people who want something meaningful for someone close to them. We offer hand-picked ideas for <strong>gift ideas for husband</strong> on anniversaries, thoughtful options for <strong>gift ideas for sister</strong> on her birthday, and practical suggestions for <strong>gift ideas for brother</strong> who has everything. We also cater to <strong>gift ideas for father</strong> who is notoriously hard to shop for, with recommendations that combine utility with genuine sentiment. Each suggestion is matched to the recipient's personality, interests, and your unique relationship with them.
                </p>

                <p>
                  Beyond immediate family, our tool supports more casual and social gifting needs. You can explore <strong>gift ideas for male friend</strong> who appreciates style, <strong>gift ideas for female friend</strong> who loves experiences over things, and <strong>gift ideas for best friend</strong> who has been there through everything. We also provide excellent recommendations for workplace and community gifting, including <strong>gift ideas for boyfriend</strong> in long-distance relationships and <strong>gift ideas for husband</strong> celebrating a milestone.
                </p>

                <h3 className="font-serif text-2xl font-light italic text-[#1A1A1A] mt-10 mb-4">
                  Gift Ideas for Kids, Students, and Family Celebrations
                </h3>

                <p>
                  Families and parents can greatly benefit from GiftIdeaFor when they need practical, fun, or sentimental choices for children. Our recommendations include <strong>return gift ideas for kids</strong> for birthday parties and school events, <strong>gift ideas for boys</strong> who love adventure and exploration, and <strong>gift ideas for girls</strong> who appreciate creativity and self-expression. Each suggestion is thoughtfully curated to match different ages, interests, and developmental stages, ensuring you find something that brings genuine joy.
                </p>

                <p>
                  The same thoughtful approach extends to school and workplace gifting scenarios. When you need <strong>teachers day gift ideas for female</strong> teachers to show appreciation, or <strong>diwali gift ideas for employees</strong> to celebrate the festival of lights with warmth and professionalism, our platform provides curated options that strike the right balance between personal and appropriate. These recommendations help make every act of appreciation feel warm, memorable, and suitable for the context.
                </p>

                <h3 className="font-serif text-2xl font-light italic text-[#1A1A1A] mt-10 mb-4">
                  What Makes Our Gift Discovery Experience Unique
                </h3>

                <p>
                  What distinguishes GiftIdeaFor from other gift finders is our focus on genuine personalization. Instead of generic category browsing, our proprietary scoring engine evaluates your quiz answers across multiple dimensions including the recipient's personality type, your relationship stage, their preferred appreciation style, and your budget range. This ensures that every recommendation—whether for <strong>gift ideas for women</strong> who love aesthetics, <strong>unique gift ideas for men</strong> who value craftsmanship, or <strong>gift ideas for girls</strong> who appreciate thoughtful details—feels individually curated rather than algorithmically random.
                </p>

                <p>
                  We also believe in quality over quantity. Every item in our catalog is hand-selected with an uncompromising anti-slop ethic. We avoid generic, mass-produced items in favor of artisan-crafted, thoughtfully designed objects that tell a story. Whether you need <strong>unique gift ideas for women</strong> who have eclectic taste, <strong>unique gift ideas for men</strong> who appreciate fine materials, or <strong>gift ideas for best friend</strong> who deserves something one-of-a-kind, our collections deliver on both beauty and meaning.
                </p>

                <p>
                  Our interactive Gift Finder Quiz is the heart of the experience. By answering nine simple questions about the recipient, occasion, relationship stage, personality, budget, and preferences, you unlock a personalized set of recommendations matched specifically to your situation. The quiz adapts its questions based on your previous answers, ensuring a contextual and relevant experience every time. Combined with our curated scrapbook galleries, community stories, and event reminder system, GiftIdeaFor becomes a complete gifting companion for everyone.
                </p>

                <p>
                  Whether your goal is to impress a partner with <strong>gift ideas for boyfriend</strong> or <strong>gift ideas for husband</strong>, delight a friend with <strong>gift ideas for best friend</strong>, celebrate a family member with <strong>gift ideas for father</strong>, <strong>gift ideas for mother</strong>, <strong>gift ideas for sister</strong>, or <strong>gift ideas for brother</strong>, or surprise a colleague with appropriate workplace gifts, GiftIdeaFor offers a smart, elegant starting point. We help you move beyond generic options and discover presents that feel intentional, useful, and unique. Explore our curated collections today and give a gift that truly reflects your thoughtfulness and care.
                </p>
              </div>
            </article>

            {/* SEO-Friendly FAQ Section */}
            <FAQSection />

            {/* Modular, high-end CTA */}
            <div className="pt-24">
              <CTA />
            </div>
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

