import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  RotateCcw,
  Calendar,
  Bell,
  Clock,
  CheckCircle2,
  Share2,
  ExternalLink,
  Filter,
  Check,
  Mail,
  CalendarPlus,
} from 'lucide-react';
import type { RecommendedGift, QuizAnswers, QuizResponse, EventReminder } from '../types';
import UserStories from './UserStories';

interface RecommendationsPageProps {
  results: QuizResponse;
  answers: QuizAnswers;
  onRetakeQuiz: () => void;
  onBackToGallery: () => void;
  onSaveRecommendedGift: (gift: RecommendedGift, answers: QuizAnswers) => void;
  savedRecommendedGiftNames: string[];
}

export default function RecommendationsPage({
  results,
  answers,
  onRetakeQuiz,
  onBackToGallery,
  onSaveRecommendedGift,
  savedRecommendedGiftNames,
}: RecommendationsPageProps) {
  const [filterType, setFilterType] = useState<'all' | 'shippable' | 'instant' | 'under50'>('all');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Reminder form state
  const [eventName, setEventName] = useState<string>(
    answers.recipient && answers.occasion
      ? `${answers.recipient}'s ${answers.occasion}`
      : 'Upcoming Special Occasion'
  );
  const [recipientName, setRecipientName] = useState<string>(answers.recipient || '');
  const [occasionName, setOccasionName] = useState<string>(answers.occasion || '');
  const [eventDate, setEventDate] = useState<string>(() => {
    // Default to 14 days from today
    const future = new Date();
    future.setDate(future.getDate() + 14);
    return future.toISOString().split('T')[0];
  });
  const [reminderTiming, setReminderTiming] = useState<'1_week_before' | '3_days_before' | 'on_day'>(
    '1_week_before'
  );
  const [email, setEmail] = useState<string>('');
  const [reminderSaved, setReminderSaved] = useState<boolean>(false);
  const [savedReminderDetails, setSavedReminderDetails] = useState<EventReminder | null>(null);

  // Check if reminder already saved for this occasion in localStorage
  useEffect(() => {
    try {
      const existing = localStorage.getItem('wtg_active_reminders');
      if (existing) {
        const list: EventReminder[] = JSON.parse(existing);
        const found = list.find((r) => r.recipientName === answers.recipient && r.occasion === answers.occasion);
        if (found) {
          setSavedReminderDetails(found);
          setReminderSaved(true);
        }
      }
    } catch (e) {
      console.error('Error loading reminders:', e);
    }
  }, [answers]);

  const handleSetReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !eventDate) return;

    const newReminder: EventReminder = {
      id: `rem_${Date.now()}`,
      eventName: eventName || `${recipientName}'s ${occasionName}`,
      recipientName: recipientName || answers.recipient || 'Loved One',
      occasion: occasionName || answers.occasion || 'Special Day',
      eventDate,
      timing: reminderTiming,
      email,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('wtg_active_reminders');
      const list: EventReminder[] = existing ? JSON.parse(existing) : [];
      list.push(newReminder);
      localStorage.setItem('wtg_active_reminders', JSON.stringify(list));
      setSavedReminderDetails(newReminder);
      setReminderSaved(true);
    } catch (err) {
      console.error('Error saving reminder:', err);
    }
  };

  const handleClearReminder = () => {
    if (!savedReminderDetails) return;
    try {
      const existing = localStorage.getItem('wtg_active_reminders');
      if (existing) {
        const list: EventReminder[] = JSON.parse(existing);
        const filtered = list.filter((r) => r.id !== savedReminderDetails.id);
        localStorage.setItem('wtg_active_reminders', JSON.stringify(filtered));
      }
    } catch (e) {
      console.error('Error clearing reminder:', e);
    }
    setSavedReminderDetails(null);
    setReminderSaved(false);
  };

  const handleShareRecommendations = () => {
    const text = `Check out these curated gift ideas for ${answers.recipient || 'a special gift'}: ${results.recommendations
      .map((r) => r.name)
      .join(', ')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSaveAll = () => {
    results.recommendations.forEach((gift) => {
      if (!savedRecommendedGiftNames.includes(gift.name)) {
        onSaveRecommendedGift(gift, answers);
      }
    });
  };

  // Filter computation
  const filteredRecommendations = results.recommendations.filter((item) => {
    if (filterType === 'under50') {
      const num = parseInt(item.priceEstimate.replace(/[^0-9]/g, ''), 10);
      return !isNaN(num) && num <= 50;
    }
    if (filterType === 'shippable') {
      return !item.categoryTag?.toLowerCase().includes('experience') && !item.categoryTag?.toLowerCase().includes('voucher');
    }
    if (filterType === 'instant') {
      return item.categoryTag?.toLowerCase().includes('experience') || item.categoryTag?.toLowerCase().includes('voucher') || item.description?.toLowerCase().includes('membership');
    }
    return true;
  });

  // Calendar Export URL Generator
  const getGoogleCalendarUrl = () => {
    if (!eventDate) return '#';
    const title = encodeURIComponent(`Gift Prep for ${eventName}`);
    const details = encodeURIComponent(
      `Selected Gift Ideas for ${answers.recipient}:\n` +
        results.recommendations.map((r) => `- ${r.name} (${r.priceEstimate})`).join('\n')
    );
    // Format YYYYMMDD
    const dateFormatted = eventDate.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateFormatted}/${dateFormatted}`;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
        <button
          onClick={onBackToGallery}
          className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scrapbook Gallery
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareRecommendations}
            className="bg-white border border-black/10 text-[#1A1A1A] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-black/60" />
                Share Ideas
              </>
            )}
          </button>

          <button
            onClick={onRetakeQuiz}
            className="bg-white border border-black/10 text-[#1A1A1A] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-black/60" />
            Retake Quiz
          </button>
        </div>
      </div>

      {/* Main Header / Curator Summary Block */}
      <div className="bg-[#FAF9F6] border border-black/10 p-8 sm:p-10 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2D1C3]/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="bg-[#1A1A1A] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
            {answers.recipient || 'Loved One'}
          </span>
          <span className="bg-[#E2D1C3] text-[#1A1A1A] text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
            {answers.occasion || 'Special Occasion'}
          </span>
          {answers.personality && (
            <span className="bg-black/5 border border-black/10 text-[#1A1A1A] text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
              {answers.personality}
            </span>
          )}
          {answers.budget && (
            <span className="bg-black/5 border border-black/10 text-[#1A1A1A] text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
              Budget: {answers.budget}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] leading-tight font-normal">
            Hand-Picked Gift Guide
          </h1>
          <p className="text-black/60 text-sm max-w-2xl">
            Custom-matched specifically for <strong className="text-[#1A1A1A]">{answers.recipient || 'them'}</strong> ({answers.relationshipStage || 'special bond'}) celebrating {answers.occasion || 'a meaningful milestone'}.
          </p>
        </div>

        {/* Personalized Message from Personal Shopping Desk */}
        <div className="bg-white p-6 border-l-2 border-[#1A1A1A] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
            Personal Shopping Desk Curation Note
          </div>
          <p className="font-serif text-[18px] italic text-[#1A1A1A] leading-relaxed">
            "{results.personalizedMessage}"
          </p>
          {results.appliedRelaxation && (
            <div className="mt-3 pt-3 border-t border-black/5 flex items-center gap-2 text-amber-800 bg-amber-50/80 px-3 py-1.5 text-xs font-mono">
              <span>⚡ Note:</span>
              <span>{results.appliedRelaxation}</span>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/50 flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Filter Matches:
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
            }`}
          >
            All Matches ({results.recommendations.length})
          </button>
          <button
            onClick={() => setFilterType('shippable')}
            className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${
              filterType === 'shippable'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
            }`}
          >
            Shippable Goods
          </button>
          <button
            onClick={() => setFilterType('instant')}
            className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${
              filterType === 'instant'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
            }`}
          >
            Instant / E-Vouchers
          </button>
          <button
            onClick={() => setFilterType('under50')}
            className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${
              filterType === 'under50'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white border border-black/10 text-black/70 hover:border-black/30'
            }`}
          >
            Under $50
          </button>
        </div>

        <button
          onClick={handleSaveAll}
          className="text-[10px] font-bold uppercase tracking-widest bg-white border border-black/15 text-[#1A1A1A] px-4 py-2 hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Bookmark className="w-3.5 h-3.5" />
          Pin All to Scrapbook
        </button>
      </div>

      {/* Recommended Items Grid */}
      <div className="space-y-6">
        {filteredRecommendations.length === 0 ? (
          <div className="p-12 text-center bg-white border border-black/10 space-y-4">
            <p className="text-black/60 font-serif text-lg">No items match the selected filter option.</p>
            <button
              onClick={() => setFilterType('all')}
              className="text-xs uppercase tracking-widest font-bold underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRecommendations.map((gift, idx) => {
            const isSaved = savedRecommendedGiftNames.includes(gift.name);
            return (
              <div
                key={gift.name}
                className="bg-white border border-black/10 hover:border-black/30 transition-all duration-300 p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start shadow-sm"
              >
                {gift.image && (
                  <div className="w-full md:w-56 h-56 flex-shrink-0 bg-black/5 overflow-hidden border border-black/5 relative group">
                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[9px] font-bold px-2 py-1 tracking-widest uppercase">
                      #{idx + 1} Recommendation
                    </span>
                  </div>
                )}

                <div className="flex-grow space-y-4 w-full">
                  <div className="flex flex-wrap justify-between items-start gap-4 border-b border-black/5 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[9px] font-bold bg-[#E2D1C3] text-[#1A1A1A] px-2.5 py-1 tracking-widest uppercase">
                          {gift.categoryTag}
                        </span>
                        {gift.score !== undefined && (
                          <span className="text-[9px] font-bold bg-[#1A1A1A] text-white px-2.5 py-1 tracking-widest uppercase">
                            Match Score: +{gift.score} pts
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                        {gift.name}
                      </h3>
                    </div>
                    <span className="text-[#1A1A1A] font-serif font-bold text-2xl sm:text-3xl whitespace-nowrap">
                      {gift.priceEstimate}
                    </span>
                  </div>

                  <p className="text-[#1A1A1A]/80 text-sm sm:text-base leading-relaxed">
                    {gift.description}
                  </p>

                  {/* Overlapped match reason tags */}
                  {gift.matchReasons && gift.matchReasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center text-xs text-black/60 pt-1">
                      <span className="font-bold text-black/80">Matched Criteria:</span>
                      {gift.matchReasons.map((reason, rIdx) => (
                        <span
                          key={rIdx}
                          className="bg-[#FAF9F6] border border-black/10 px-2.5 py-0.5 text-[11px] font-medium text-black/80"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Curated Why Fits Block */}
                  <div className="bg-[#FAF9F6] p-4 border-l-2 border-[#E2D1C3] border border-black/5 text-xs sm:text-sm space-y-1">
                    <p className="font-bold text-[#1A1A1A] uppercase text-[10px] tracking-wider">
                      Why this gift fits {answers.recipient || 'them'}:
                    </p>
                    <p className="text-black/75 italic leading-relaxed">
                      {gift.whyFits}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => onSaveRecommendedGift(gift, answers)}
                      className={`py-3 px-6 text-[10px] uppercase tracking-widest font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                          : 'border-black/15 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-4 h-4" />
                          Saved in Scrapbook
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          Pin to My Scrapbook
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* User Stories & Genuine Reactions */}
      <div className="pt-12">
        <UserStories />
      </div>

      {/* DEDICATED BOTTOM SECTION: SET A REMINDER FOR VISITORS / EARLY BROWSERS */}
      <section className="bg-[#1A1A1A] text-white p-8 sm:p-12 border border-black/20 space-y-8 relative overflow-hidden mt-16">
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#E2D1C3]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-[#E2D1C3] text-[10px] uppercase font-bold tracking-widest">
            <Bell className="w-4 h-4" />
            Planning Ahead or Just Visiting?
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Set an Event Reminder for {answers.recipient ? `${answers.recipient}'s ${answers.occasion}` : 'This Occasion'}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            If you're browsing early or saving options for later, set a reminder now. We'll send a gentle notification to your inbox before the big date so you're never caught off guard.
          </p>
        </div>

        {reminderSaved && savedReminderDetails ? (
          <div className="bg-white/10 border border-white/20 p-6 space-y-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#E2D1C3] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">
                  Reminder Active for {savedReminderDetails.eventName}!
                </h4>
                <p className="text-white/80 text-xs leading-relaxed">
                  We'll send a reminder email to <strong className="text-white">{savedReminderDetails.email}</strong>{' '}
                  {savedReminderDetails.timing === '1_week_before'
                    ? '1 week before'
                    : savedReminderDetails.timing === '3_days_before'
                    ? '3 days before'
                    : 'on the day of'}{' '}
                  the event (<strong className="text-white">{savedReminderDetails.eventDate}</strong>).
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E2D1C3] text-[#1A1A1A] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors inline-flex items-center gap-1.5"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Add to Google Calendar
              </a>

              <button
                onClick={handleClearReminder}
                className="text-white/60 hover:text-white text-xs underline cursor-pointer"
              >
                Cancel or Reset Reminder
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSetReminder} className="space-y-6 bg-white/5 border border-white/10 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/80">
                  Event / Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Alex's Birthday"
                  className="w-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E2D1C3]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/80">
                  Occasion Date
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2D1C3]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/80">
                  When Should We Remind You?
                </label>
                <select
                  value={reminderTiming}
                  onChange={(e: any) => setReminderTiming(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-white/20 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2D1C3]"
                >
                  <option value="1_week_before">1 Week Before (Recommended for shipping)</option>
                  <option value="3_days_before">3 Days Before</option>
                  <option value="on_day">On the Exact Day</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/80">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/10 border border-white/20 pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E2D1C3]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <p className="text-xs text-white/50">
                🔒 No spam, ever. Only 1 timely email reminder before the event.
              </p>

              <button
                type="submit"
                className="bg-[#E2D1C3] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest px-8 py-3 hover:bg-white transition-all cursor-pointer flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Set Free Event Reminder
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
