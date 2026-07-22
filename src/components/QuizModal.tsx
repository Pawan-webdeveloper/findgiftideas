import React, { useState } from 'react';
import { X, Sparkles, Loader2, Bookmark, BookmarkCheck, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import type { QuizAnswers, RecommendedGift, QuizResponse } from '../types';
import { PRODUCT_CATALOG } from '../products';
import { scoreProducts } from '../scoring';

interface QuizModalProps {
  onClose: () => void;
  onSaveRecommendedGift: (gift: RecommendedGift, answers: QuizAnswers) => void;
  savedRecommendedGiftNames: string[];
  onCompleteQuiz: (results: QuizResponse, answers: QuizAnswers) => void;
}

export default function QuizModal({
  onClose,
  onSaveRecommendedGift,
  savedRecommendedGiftNames,
  onCompleteQuiz,
}: QuizModalProps) {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    recipient: '',
    occasion: '',
    relationshipStage: '',
    personality: '',
    wantsOrComplaints: '',
    avoid: '',
    appreciationStyle: '',
    budget: '',
    urgency: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResponse | null>(null);

  // Dynamic step-definition getter to support custom/conditional fields
  const getStepData = (currentStep: number, currentAnswers: QuizAnswers) => {
    switch (currentStep) {
      case 1:
        return {
          title: "Who is this gift for?",
          subtitle: "This is your base relationship tag.",
          field: 'recipient' as const,
          type: 'options',
          options: [
            { value: 'Boyfriend', label: 'Boyfriend', icon: '🧑‍❤️‍👨' },
            { value: 'Girlfriend', label: 'Girlfriend', icon: '👩‍❤️‍💋‍👩' },
            { value: 'Mom', label: 'Mom', icon: '🌸' },
            { value: 'Dad', label: 'Dad', icon: '👔' },
            { value: 'Close friend', label: 'Close friend', icon: '🥰' },
            { value: 'School/college friend', label: 'School/college friend', icon: '🎒' },
            { value: 'Sibling', label: 'Sibling', icon: '👦👧' },
            { value: 'Grandparent or elder', label: 'Grandparent or elder', icon: '👵' },
            { value: 'Coworker', label: 'Coworker', icon: '💻' },
            { value: 'Other', label: 'Other', icon: '✨' },
          ],
        };
      case 2:
        return {
          title: "What's the occasion?",
          subtitle: "Occasion changes tone more than relationship does.",
          field: 'occasion' as const,
          type: 'options',
          options: [
            { value: 'Birthday', label: 'Birthday', icon: '🎂' },
            { value: 'Anniversary', label: 'Anniversary', icon: '💍' },
            { value: 'Just because', label: 'Just because', icon: '🎁' },
            { value: 'A milestone or achievement', label: 'A milestone or achievement', icon: '🎓' },
            { value: 'Apologizing / making up', label: 'Apologizing / making up', icon: '🙏' },
            { value: 'Missing them (long distance)', label: 'Missing them (long distance)', icon: '✈️' },
            { value: 'Saying goodbye', label: 'Saying goodbye', icon: '👋' },
            { value: 'A festival or holiday', label: 'A festival or holiday', icon: '🎄' },
            { value: 'They\'re going through something hard', label: 'They\'re going through something hard', icon: '❤️' },
          ],
        };
      case 3: {
        const isPartner = ['Boyfriend', 'Girlfriend'].includes(currentAnswers.recipient);
        const isFamily = ['Mom', 'Dad', 'Sibling', 'Grandparent or elder'].includes(currentAnswers.recipient);
        
        let title = "Where are things at with them right now?";
        let subtitle = "Signals you actually get relationships, not just categories.";
        let options: { value: string; label: string; icon: string }[] = [];
        
        if (isPartner) {
          title = "Where are things at with your partner right now?";
          options = [
            { value: 'Just started dating', label: 'Just started dating', icon: '🌱' },
            { value: 'A few months in', label: 'A few months in', icon: '✨' },
            { value: 'Long-term and settled', label: 'Long-term and settled', icon: '🏡' },
            { value: 'Long distance right now', label: 'Long distance right now', icon: '📍' },
          ];
        } else if (isFamily) {
          title = "Where are things at with your family member right now?";
          options = [
            { value: 'Close, talk all the time', label: 'Close, talk all the time', icon: '📞' },
            { value: 'Love them but not super close', label: 'Love them but not super close', icon: '🤍' },
            { value: 'Complicated, but I care', label: 'Complicated, but I care', icon: '🤝' },
          ];
        } else {
          title = "Where are things at with your friend right now?";
          options = [
            { value: 'Known forever', label: 'Known forever', icon: '🕰️' },
            { value: 'New but clicking', label: 'New but clicking', icon: '⚡' },
            { value: 'Drifted apart, reconnecting', label: 'Drifted apart, reconnecting', icon: '💞' },
          ];
        }
        
        return {
          title,
          subtitle,
          field: 'relationshipStage' as const,
          type: 'options',
          options,
        };
      }
      case 4:
        return {
          title: "Which of these sounds most like them?",
          subtitle: "Choose one primary personality style.",
          field: 'personality' as const,
          type: 'options',
          options: [
            { value: 'The planner (organized, loves routine)', label: 'The planner', icon: '📅' },
            { value: 'The dreamer (sentimental, nostalgic)', label: 'The dreamer', icon: '💭' },
            { value: 'The adventurer (spontaneous, active)', label: 'The adventurer', icon: '🏔️' },
            { value: 'The homebody (cozy, comfort-loving)', label: 'The homebody', icon: '🛋️' },
            { value: 'The aesthete (cares how things look)', label: 'The aesthete', icon: '🎨' },
            { value: 'The practical one (hates clutter)', label: 'The practical one', icon: '📐' },
            { value: 'The jokester (doesn\'t take life too seriously)', label: 'The jokester', icon: '🃏' },
          ],
        };
      case 5:
        return {
          title: "What's something small they've mentioned wanting or complained about not having?",
          subtitle: "Optional memory recall that makes the gift deeply personal.",
          field: 'wantsOrComplaints' as const,
          type: 'text',
          placeholder: "e.g., 'my earphones keep dying' or 'I never have good pens at work'",
          options: [],
        };
      case 6:
        return {
          title: "What should we avoid? Anything they already have enough of?",
          subtitle: "Avoid standard, repetitive, or undesirable items.",
          field: 'avoid' as const,
          type: 'options',
          options: [
            { value: 'Candles', label: 'Candles', icon: '🕯️' },
            { value: 'Mugs', label: 'Mugs', icon: '☕' },
            { value: 'Generic tech gadgets', label: 'Generic tech gadgets', icon: '🔌' },
            { value: 'More clothes', label: 'More clothes', icon: '👕' },
            { value: 'Anything they\'d have to store', label: 'Anything they\'d have to store', icon: '📦' },
            { value: 'Nothing specific', label: 'Nothing specific', icon: '✅' },
          ],
        };
      case 7:
        return {
          title: "How do they usually feel most appreciated?",
          subtitle: "Lightly adapted love-language framing for experience vs. product biasing.",
          field: 'appreciationStyle' as const,
          type: 'options',
          options: [
            { value: 'Thoughtful words or gestures', label: 'Thoughtful words or gestures', icon: '✉️' },
            { value: 'Quality time or shared experiences', label: 'Quality time or shared experiences', icon: '🎟️' },
            { value: 'A well-chosen physical gift', label: 'A well-chosen physical gift', icon: '🎁' },
            { value: 'Something that makes their life easier', label: 'Something that makes their life easier', icon: '🛠️' },
            { value: 'Surprises and spontaneity', label: 'Surprises and spontaneity', icon: '🎉' },
          ],
        };
      case 8:
        return {
          title: "What's your budget?",
          subtitle: "Find matching suggestions in your preferred range.",
          field: 'budget' as const,
          type: 'options',
          options: [
            { value: 'Under a modest amount', label: 'Under a modest amount', icon: '🪙' },
            { value: 'A mid-range amount', label: 'A mid-range amount', icon: '✉️' },
            { value: 'A generous amount', label: 'A generous amount', icon: '🏷️' },
            { value: 'No limit, tell me the best option', label: 'No limit, tell me the best option', icon: '💎' },
          ],
        };
      case 9:
        return {
          title: "How soon do you need this?",
          subtitle: "Filters shippable products vs. instant e-gifts/experiences.",
          field: 'urgency' as const,
          type: 'options',
          options: [
            { value: 'Today or tomorrow', label: 'Today or tomorrow', icon: '⚡' },
            { value: 'This week', label: 'This week', icon: '📅' },
            { value: 'A few weeks out', label: 'A few weeks out', icon: '⏳' },
            { value: 'Just browsing for later', label: 'Just browsing for later', icon: '🔍' },
          ],
        };
      default:
        return {
          title: '',
          subtitle: '',
          field: 'recipient' as const,
          type: 'options',
          options: [],
        };
    }
  };

  const currentStepData = getStepData(step, answers);

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentStepData.field]: value }));
  };

  const handleNext = () => {
    if (step < 9) {
      setStep((prev) => prev + 1);
    } else {
      generateRecommendations();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Deterministic rule-based scoring engine execution
      const data: QuizResponse = scoreProducts(answers, PRODUCT_CATALOG, 5);
      onCompleteQuiz(data, answers);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({
      recipient: '',
      occasion: '',
      relationshipStage: '',
      personality: '',
      wantsOrComplaints: '',
      avoid: '',
      appreciationStyle: '',
      budget: '',
      urgency: '',
    });
    setResults(null);
    setError(null);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] rounded-none w-full max-w-2xl overflow-hidden shadow-2xl relative border border-black/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/5 flex justify-between items-center bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
            <span className="font-serif font-light italic text-[#1A1A1A] text-lg">
              Interactive Gift Finder
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#1A1A1A] hover:bg-black/5 p-2 rounded-none transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        {step <= 9 && (
          <div className="w-full bg-black/5 h-1">
            <div
              className="bg-[#1A1A1A] h-1 transition-all duration-300"
              style={{ width: `${(step / 9) * 100}%` }}
            />
          </div>
        )}

        <div className="overflow-y-auto p-6 md:p-8 flex-grow custom-scrollbar">
          {/* Loading Screen */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-[#1A1A1A]" />
                <Sparkles className="w-6 h-6 absolute top-5 left-5 text-[#E2D1C3] animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-light italic text-[#1A1A1A]">
                  Consulting Gifting Scrapbooks...
                </h3>
                <p className="text-black/60 text-sm max-w-sm leading-relaxed">
                  Our AI boutique personal shopper is reviewing thousand of exquisite physical collections to discover three flawless matches.
                </p>
              </div>
            </div>
          )}

          {/* Error Screen */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <span className="text-4xl">⚠️</span>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Shopping Desk Interrupted
              </h3>
              <p className="text-red-700/80 text-sm max-w-sm leading-relaxed">
                {error}
              </p>
              <button
                onClick={generateRecommendations}
                className="mt-4 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-none text-[10px] font-bold tracking-widest uppercase hover:bg-black/85 transition-all cursor-pointer"
              >
                Retry Selection
              </button>
            </div>
          )}

          {/* Interactive Steps */}
          {!loading && !error && step <= 9 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.2em] block">
                  Question {step} of 9
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-light italic text-[#1A1A1A] leading-tight">
                  {currentStepData.title}
                </h2>
                <p className="text-black/60 text-sm font-normal">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Options Grid or Text Input */}
              {currentStepData.type === 'options' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentStepData.options.map((opt) => {
                    const isSelected = answers[currentStepData.field as keyof QuizAnswers] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        className={`p-4 rounded-none border text-left flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#E2D1C3] border-transparent text-[#1A1A1A] scale-[1.01] font-semibold'
                            : 'bg-white border-black/5 hover:border-black/25 text-[#1A1A1A] hover:bg-black/5'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="pt-2">
                  <textarea
                    rows={4}
                    value={answers.wantsOrComplaints || ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, wantsOrComplaints: e.target.value }))}
                    placeholder={currentStepData.placeholder}
                    className="w-full p-4 rounded-none border border-black/15 bg-white text-[#1A1A1A] text-sm focus:border-black focus:outline-none transition-all resize-none placeholder:text-black/30 font-sans"
                  />
                  <p className="text-xs text-black/40 mt-2 italic">
                    Press Continue to skip this question if nothing specific comes to mind.
                  </p>
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-8 border-t border-black/5">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-none text-[10px] uppercase tracking-widest font-bold border border-black/10 text-[#1A1A1A] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStepData.type === 'options' && !answers[currentStepData.field as keyof QuizAnswers]}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] hover:bg-black/80 text-white rounded-none text-[10px] uppercase tracking-widest font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {step === 9 ? 'Find Perfect Gift' : 'Continue'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Results Screen */}
          {!loading && !error && step === 10 && results && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Introduction header */}
              <div className="bg-white p-6 rounded-none border border-black/5 shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#1A1A1A]/40 tracking-[0.2em] uppercase block mb-1">
                  Boutique Curator Note
                </span>
                <p className="font-serif text-[17px] italic text-[#1A1A1A] leading-relaxed">
                  "{results.personalizedMessage}"
                </p>

                {results.appliedRelaxation && (
                  <div className="mt-3 pt-3 border-t border-black/5 flex items-center gap-2 text-amber-800 bg-amber-50 px-3 py-1.5 text-xs font-mono">
                    <span>⚡ Note:</span>
                    <span>{results.appliedRelaxation}</span>
                  </div>
                )}
              </div>

              {/* Suggestions items stack */}
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-black/5 pb-2 flex items-center justify-between">
                  <span>Custom Hand-Picked Matches</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold font-sans">
                    {results.recommendations.length} Matches Found
                  </span>
                </h3>

                <div className="space-y-4">
                  {results.recommendations.map((gift) => {
                    const isSaved = savedRecommendedGiftNames.includes(gift.name);
                    return (
                      <div
                        key={gift.name}
                        className="bg-white p-6 rounded-none border border-black/5 hover:border-black/25 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start"
                      >
                        {gift.image && (
                          <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden bg-black/5 border border-black/5">
                            <img
                              src={gift.image}
                              alt={gift.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-grow space-y-3 w-full">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-[9px] font-bold bg-[#E2D1C3] text-[#1A1A1A] px-2.5 py-1 rounded-none tracking-widest uppercase block">
                                  {gift.categoryTag}
                                </span>
                                {gift.score !== undefined && (
                                  <span className="text-[9px] font-bold bg-[#1A1A1A] text-white px-2 py-1 rounded-none tracking-widest uppercase">
                                    Score: +{gift.score} pts
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif text-[20px] font-bold text-[#1A1A1A]">
                                {gift.name}
                              </h4>
                            </div>
                            <span className="text-[#1A1A1A] font-serif font-bold text-[20px] whitespace-nowrap">
                              {gift.priceEstimate}
                            </span>
                          </div>

                          <p className="text-[#1A1A1A]/70 text-[13.5px] leading-relaxed">
                            {gift.description}
                          </p>

                          {/* Overlapped tags debug/validation display */}
                          {gift.matchReasons && gift.matchReasons.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 items-center text-[10px] text-black/60 pt-1">
                              <span className="font-bold text-black/80">Matches:</span>
                              {gift.matchReasons.map((reason, idx) => (
                                <span
                                  key={idx}
                                  className="bg-black/5 border border-black/10 px-2 py-0.5 rounded-none font-medium text-black/70"
                                >
                                  {reason}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="bg-black/5 p-3.5 rounded-none border border-black/5 text-xs">
                            <p className="font-bold text-[#1A1A1A] mb-0.5">
                              Why this fits:
                            </p>
                            <p className="text-black/70 italic leading-relaxed">
                              {gift.whyFits}
                            </p>
                          </div>

                          <button
                            onClick={() => onSaveRecommendedGift(gift, answers)}
                            className={`w-full py-2.5 px-4 rounded-none text-[10px] uppercase tracking-widest font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isSaved
                                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                                : 'border-black/10 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6] hover:border-transparent'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <BookmarkCheck className="w-4 h-4" />
                                Saved to Scrapbook
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
                    );
                  })}
                </div>
              </div>

              {/* Footer resetting controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-black/5 gap-3">
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#1A1A1A] hover:opacity-50 font-bold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Different Choices
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-[#1A1A1A] text-white px-8 py-3 rounded-none text-[10px] uppercase font-bold tracking-widest hover:bg-black/80 transition-all cursor-pointer"
                >
                  Done Exploring
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
