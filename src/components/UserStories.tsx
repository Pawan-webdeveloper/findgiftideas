import React, { useState, useEffect } from 'react';
import {
  Heart,
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  MessageSquarePlus,
  X,
  Send,
  ThumbsUp,
  Smile,
  Gift,
  Filter,
} from 'lucide-react';
import type { UserStory } from '../types';

const INITIAL_STORIES: UserStory[] = [
  {
    id: 'us_1',
    authorName: 'Marcus & Elena',
    authorRole: '3-Year Long Distance Partner',
    recipient: 'Girlfriend (Elena)',
    occasion: '3rd Anniversary',
    matchedGift: 'Custom Coordinates Stamped Brass Keychain',
    giftPrice: '$22',
    rating: 5,
    storyText:
      'We live 400 miles apart, and every anniversary I usually panic trying to find something meaningful without being cheesy. I entered our details into the quiz, and it matched the stamped brass keychain with the exact longitude & latitude of the coffee shop where we first met.',
    impactOutcome: 'She actually cried when opening the package on FaceTime!',
    category: 'romance',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop',
    dateAgo: '3 days ago',
    verified: true,
  },
  {
    id: 'us_2',
    authorName: 'Priya K.',
    authorRole: 'Daughter shopping for hard-to-buy dad',
    recipient: 'Dad',
    occasion: '60th Milestone Birthday',
    matchedGift: 'Hand-Forged 67-Layer Damascus Paring Knife',
    giftPrice: '$120',
    rating: 5,
    storyText:
      'My dad is notoriously impossible to buy for because if he wants something, he buys it himself. The algorithm asked about small complaints, and I noted he loves Sunday prep but grumbles about dull knives. It suggested a VG-10 Damascus knife.',
    impactOutcome: 'He has used it literally every single night since his birthday.',
    category: 'family',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=600&auto=format&fit=crop',
    dateAgo: '1 week ago',
    verified: true,
  },
  {
    id: 'us_3',
    authorName: 'Liam & Sam',
    authorRole: 'College Roommates & Best Friends',
    recipient: 'Best Friend (Sam)',
    occasion: 'Moving Away / Goodbye',
    matchedGift: 'Artisanal Pasta & Sauce Masterclass (E-Voucher)',
    giftPrice: '$65',
    rating: 5,
    storyText:
      'Instead of giving him another dust-collecting keepsake before he packed his apartment, the recommendation engine steered me toward a live cooking class experience for two. We did the pasta class over Zoom after he moved to Chicago.',
    impactOutcome: 'Gave us a fun reason to connect right when we missed each other.',
    category: 'friends',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop',
    dateAgo: '2 weeks ago',
    verified: true,
  },
  {
    id: 'us_4',
    authorName: 'Sarah M.',
    authorRole: 'Thoughtful Daughter',
    recipient: 'Mom',
    occasion: 'Just Because / Hard Times',
    matchedGift: 'Old Library Wood & Vanilla Soy Amber Candle',
    giftPrice: '$26',
    rating: 5,
    storyText:
      'Mom was going through a stressful month with work and hates flashy gifts. The quiz algorithm picked up on her homebody profile and suggested a hand-poured cozy mahogany amber candle.',
    impactOutcome: 'She called me immediately saying: "How did you know this is what my bedroom needed?"',
    category: 'family',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop',
    dateAgo: '3 weeks ago',
    verified: true,
  },
  {
    id: 'us_5',
    authorName: 'Dev R.',
    authorRole: 'Early Stage Dating',
    recipient: 'New Girlfriend (3 Months)',
    occasion: 'Birthday',
    matchedGift: 'Japanese Hinoki Coffee Spoon & Single-Origin Beans',
    giftPrice: '$38',
    rating: 5,
    storyText:
      'I didn\'t want to come on too strong with expensive jewelry after only 12 weeks of dating. The quiz flagged "Low Stakes, High Quality" and suggested artisan single-origin coffee with a cypress spoon.',
    impactOutcome: 'She loved that it was thoughtful without feeling overwhelming.',
    category: 'romance',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    dateAgo: '1 month ago',
    verified: true,
  },
  {
    id: 'us_6',
    authorName: 'Ananya S.',
    authorRole: 'Sister & Maid of Honor',
    recipient: 'Sister',
    occasion: 'Milestone Engagement',
    matchedGift: 'Pure Mulberry Silk Pillowcase & Sleep Mask Set',
    giftPrice: '$85',
    rating: 5,
    storyText:
      'My sister was overwhelmed with wedding planning. The recommendation engine picked out luxury silk rest gear to give her guilt-free relaxation. She said it was the most comforting gift among all the bridal stuff.',
    impactOutcome: 'Saved her sleep during peak planning stress!',
    category: 'milestones',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    dateAgo: '1 month ago',
    verified: true,
  },
];

export default function UserStories() {
  const [stories, setStories] = useState<UserStory[]>(INITIAL_STORIES);
  const [activeCategory, setActiveCategory] = useState<'all' | 'romance' | 'family' | 'friends' | 'milestones'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  // Form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newOccasion, setNewOccasion] = useState('');
  const [newGift, setNewGift] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newCategory, setNewCategory] = useState<'romance' | 'family' | 'friends' | 'milestones'>('romance');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Load custom submitted stories from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wtg_user_submitted_stories');
      if (saved) {
        const parsed: UserStory[] = JSON.parse(saved);
        setStories([...parsed, ...INITIAL_STORIES]);
      }
    } catch (e) {
      console.error('Error loading stories:', e);
    }
  }, []);

  const handleLikeStory = (id: string) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newGift || !newStory) return;

    const newStoryObj: UserStory = {
      id: `story_${Date.now()}`,
      authorName: newAuthor,
      authorRole: newRole || 'Giver & Reviewer',
      recipient: newRecipient || 'Loved One',
      occasion: newOccasion || 'Special Occasion',
      matchedGift: newGift,
      giftPrice: 'Verified Match',
      rating: 5,
      storyText: newStory,
      impactOutcome: newOutcome || 'Brought genuine joy to the recipient!',
      category: newCategory,
      dateAgo: 'Just now',
      verified: true,
    };

    const updated = [newStoryObj, ...stories];
    setStories(updated);

    try {
      const existingSaved = localStorage.getItem('wtg_user_submitted_stories');
      const customList: UserStory[] = existingSaved ? JSON.parse(existingSaved) : [];
      customList.unshift(newStoryObj);
      localStorage.setItem('wtg_user_submitted_stories', JSON.stringify(customList));
    } catch (err) {
      console.error('Error saving story to localStorage:', err);
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      // Reset form
      setNewAuthor('');
      setNewRole('');
      setNewRecipient('');
      setNewOccasion('');
      setNewGift('');
      setNewStory('');
      setNewOutcome('');
    }, 2000);
  };

  const filteredStories = stories.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <section className="space-y-12 py-12 border-t border-black/10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]">
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            <span>Genuine Buyer & Recipient Stories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal leading-tight">
            Real Reactions to Recommended Gifts
          </h2>
          <p className="text-black/60 text-sm sm:text-base leading-relaxed">
            Read authentic thoughts from shoppers who used our algorithm finder to choose gifts that made their loved ones feel truly seen, remembered, and understood.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-[#1A1A1A] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#E2D1C3] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center gap-2 self-start md:self-end whitespace-nowrap shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Share Your Gifting Story
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#FAF9F6] border border-black/10 p-6">
        <div className="space-y-1 border-r border-black/5 pr-4">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">98.6%</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Match Satisfaction
          </p>
        </div>
        <div className="space-y-1 md:border-r border-black/5 pr-4">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">14,200+</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Gifts Recommended
          </p>
        </div>
        <div className="space-y-1 border-r border-black/5 pr-4 pt-4 md:pt-0">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">0</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Generic Clutter
          </p>
        </div>
        <div className="space-y-1 pt-4 md:pt-0">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">4.9/5</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Average Happiness Rating
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap border-b border-black/10 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" />
          Filter Stories:
        </span>
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
          }`}
        >
          All Experiences ({stories.length})
        </button>
        <button
          onClick={() => setActiveCategory('romance')}
          className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeCategory === 'romance'
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
          }`}
        >
          Partners & Dating
        </button>
        <button
          onClick={() => setActiveCategory('family')}
          className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeCategory === 'family'
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
          }`}
        >
          Parents & Family
        </button>
        <button
          onClick={() => setActiveCategory('friends')}
          className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeCategory === 'friends'
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
          }`}
        >
          Friends & Roommates
        </button>
        <button
          onClick={() => setActiveCategory('milestones')}
          className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeCategory === 'milestones'
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
          }`}
        >
          Milestones & Big Moments
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStories.map((story) => {
          const likes = likesMap[story.id] || 0;
          return (
            <article
              key={story.id}
              className="bg-white border border-black/10 hover:border-black/30 transition-all duration-300 p-6 flex flex-col justify-between space-y-6 shadow-sm relative group"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 border-b border-black/5 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-serif font-bold text-lg text-[#1A1A1A]">
                        {story.authorName}
                      </span>
                      {story.verified && (
                        <span className="inline-flex items-center text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-black/50 italic">{story.authorRole}</p>
                  </div>

                  <div className="flex items-center text-amber-500">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Product Tag Badge */}
                <div className="bg-[#FAF9F6] p-3 border border-black/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-black/50">
                    <span>Bought Recommendation</span>
                    <span className="text-[#1A1A1A]">{story.giftPrice}</span>
                  </div>
                  <div className="font-serif font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
                    {story.matchedGift}
                  </div>
                </div>

                {/* Story quote */}
                <div className="relative pl-4 border-l-2 border-[#E2D1C3] space-y-2">
                  <Quote className="w-4 h-4 text-black/20 absolute -left-2 -top-2" />
                  <p className="text-sm text-black/80 leading-relaxed font-sans pt-1">
                    "{story.storyText}"
                  </p>
                </div>

                {/* Outcome Callout */}
                {story.impactOutcome && (
                  <div className="bg-amber-50/60 border border-amber-200/60 p-3 text-xs text-amber-900 font-medium flex items-start gap-2">
                    <Smile className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase text-[9px] tracking-wider block text-amber-800">
                        Reaction & Outcome:
                      </span>
                      "{story.impactOutcome}"
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs text-black/50">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  For: {story.recipient} ({story.occasion})
                </span>

                <button
                  onClick={() => handleLikeStory(story.id)}
                  className="flex items-center gap-1.5 text-black/60 hover:text-[#1A1A1A] transition-colors cursor-pointer bg-black/5 hover:bg-black/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Resonated ({likes})</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* SHARE YOUR STORY MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-black/20 max-w-lg w-full p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-6 right-6 text-black/40 hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-black/10 pb-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
                Share Your Experience
              </div>
              <h3 className="font-serif text-2xl text-[#1A1A1A] font-bold">
                How Did Your Gift Recommendation Go?
              </h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Did your recipient love their gift? Share your honest review to help fellow gift-givers find inspiration.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3 my-6 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-emerald-900">
                  Thank You for Sharing Your Story!
                </h4>
                <p className="text-xs text-emerald-800">
                  Your story has been added to our community wall.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitStory} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/70 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Alex T."
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-black/15 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/70 mb-1">
                      Relationship / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Partner of 2 yrs"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-black/15 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/70 mb-1">
                      Gift Purchased
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Damascus Knife"
                      value={newGift}
                      onChange={(e) => setNewGift(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-black/15 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/70 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-black/15 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    >
                      <option value="romance">Partners & Dating</option>
                      <option value="family">Parents & Family</option>
                      <option value="friends">Friends & Coworkers</option>
                      <option value="milestones">Milestones & Big Moments</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black/70 mb-1">
                    Your Story / Genuine Thought
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us why you chose this, how the recommendation helped, or how they reacted..."
                    value={newStory}
                    onChange={(e) => setNewStory(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-black/15 p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black/70 mb-1">
                    Recipient's Reaction / Outcome (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., She said it was the best gift she received all year!"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-black/15 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border border-black/10 text-black/70 hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-[#1A1A1A] text-white hover:bg-[#E2D1C3] hover:text-[#1A1A1A] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publish Story
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
