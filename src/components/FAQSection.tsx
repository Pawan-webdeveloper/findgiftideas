import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Unique gift ideas for men who have everything?',
    answer:
      'For men who seemingly have everything, the best approach is to focus on experiences, consumables, or personalized items rather than material objects. Consider artisanal subscription boxes (like premium coffee, whiskey, or steak deliveries), custom-engraved bar tools or grooming accessories, a masterclass in a skill they admire (woodworking, photography, or mixology), or handcrafted leather goods that age beautifully. Experiential gifts like a private cooking class, a hot air balloon ride, or tickets to a niche event they would never buy themselves often make the most memorable impression. The key is finding something aligned with their passions that adds convenience, joy, or a story to their life.',
  },
  {
    question: 'What are some birthday gift ideas for him?',
    answer:
      'Birthday gift ideas for him depend largely on his personality, hobbies, and your relationship. For the practical man, consider premium everyday carry items like a brass pocket knife, a minimalist cardholder, or a high-quality pen. For the homebody, luxury candles, a weighted blanket, or a high-end coffee brewing setup work beautifully. For the adventurer, a portable hammock, a durable water bottle, or a subscription to a camping gear rental service. Tech enthusiasts appreciate useful gadgets like a smart notebook, a wireless charging station, or noise-canceling earbuds. Always pair the gift with a handwritten note to add a personal touch that elevates even the simplest present into something truly meaningful.',
  },
  {
    question: 'What are some birthday gift ideas for her?',
    answer:
      'Thoughtful birthday gift ideas for her should reflect her unique tastes, lifestyle, and the stage of your relationship. For the aesthetic-loving woman, consider artisan soy candles, a silk pillowcase set, or a curated jewelry box with minimalist pieces. For the self-care enthusiast, a luxury bath hamper, a weighted eye mask, or a subscription to a premium skincare discovery box. For the creative soul, a high-quality leather journal, a botanical illustration workshop, or a set of professional-grade art supplies. Experiences often outshine objects: book a private floral arranging class, a wine tasting at a local vineyard, or a weekend getaway to a charming bed and breakfast. The most successful birthday gifts show that you have been paying attention to what she genuinely enjoys.',
  },
  {
    question: 'Gift ideas for 8 year old boy who likes sports?',
    answer:
      'An 8-year-old boy who loves sports will appreciate gifts that keep him active, engaged, and inspired. Consider age-appropriate sports equipment upgrades like a personalized youth baseball bat, a quality soccer ball with his favorite team logo, or a beginner\'s basketball hoop for the driveway. Interactive sports toys such as a pop-up soccer goal set, a football throwing target, or a mini golf putting set for the backyard are excellent for hands-on play. Sports-themed board games or trading card packs can nurture his passion indoors. For a truly memorable gift, consider tickets to a local professional game, a sports camp session, or a personalized jersey with his name on the back—these experiences create lasting memories beyond just another toy.',
  },
  {
    question: 'Gift ideas for men who have everything?',
    answer:
      'When searching for gift ideas for men who already have everything, shift your focus from possessions to presence and personalization. Customized gifts such as an engraved pocket watch, a monogrammed dopp kit, or a leather-bound journal with his initials add sentimental value that no store-bought item can replicate. Subscription services tailored to his interests—like a monthly craft beer club, a gourmet snack box, or a curated coffee roaster delivery—offer the gift of ongoing discovery. Handcrafted items from small artisans, such as a forged steel bottle opener, a hand-thrown ceramic mug, or a walnut cutting board, bring warmth and originality. Ultimately, the best gift for someone who has everything is something that shows deep consideration: a framed memory, a planned experience with loved ones, or a donation to a cause he cares about deeply.',
  },
  {
    question: 'Gift ideas for artists who draw?',
    answer:
      'Artists who draw will cherish gifts that enhance their craft, spark inspiration, or improve their creative workspace. Start with high-quality consumables they will actually use: a set of professional-grade graphite pencils, premium micron pens in various tip sizes, a high-opacity white gel pen for highlights, or a luxury sketchbook with thick, toothy paper that handles multiple mediums. Practical tools like a portable drawing tablet, a sturdy easel for home use, an adjustable desk lamp with natural daylight bulbs, or a rolling organizer for art supplies are deeply appreciated. For inspiration, consider art books featuring masters of their preferred style, a subscription to a reference photo library, or a voucher for an online course from a professional illustrator. The most thoughtful gift for a drawing artist is one that removes friction between them and their art.',
  },
  {
    question: 'Gift ideas for 70 year old man who has everything?',
    answer:
      'For a 70-year-old man who seems to have everything, the most meaningful gifts center on comfort, nostalgia, connection, and ease. Consider cozy luxuries like a premium merino wool cardigan, memory foam slippers, or an electric heated throw for chilly evenings. Nostalgic gifts such as a digital photo frame pre-loaded with family pictures, a custom map of his hometown or favorite travel destination, or a vinyl record player with classic albums from his youth can spark joy and reminiscence. Experiences that require minimal effort on his part are wonderful: a pre-arranged monthly dinner with family, tickets to a classic car show or jazz concert, or a subscription to a streaming service he would enjoy. Practical gifts that improve daily life—a pill organizer with Bluetooth reminders, a high-quality magnifying lamp for reading, or a comfortable zero-gravity lounger—show genuine care and thoughtfulness.',
  },
  {
    question: 'Gift ideas for someone who has had a stroke?',
    answer:
      'When choosing a gift for someone recovering from a stroke, prioritize comfort, accessibility, encouragement, and dignity. Practical aids that promote independence are both thoughtful and useful: adaptive clothing with magnetic buttons or Velcro closures, a large-button universal remote, a lightweight reaching tool, or non-slip socks with gripping soles. Cognitive stimulation gifts such as large-print word search books, simple jigsaw puzzles with fewer pieces, a high-contrast card game, or an audiobook subscription can support recovery gently. Comfort items like a soft throw blanket, a weighted lap pad for anxiety relief, or a stylish yet functional insulated mug with an easy-grip handle show deep consideration. Most importantly, gifts of your time and presence—scheduled visits to play cards, share a meal, or simply sit together—are the most healing presents of all.',
  },
  {
    question: 'Gift ideas for my cousin?',
    answer:
      'Gift ideas for your cousin depend on your relationship dynamic—whether they are more like a sibling, a close friend, or a relative you see occasionally. For a close cousin, personalized gifts work wonderfully: a custom piece of jewelry with both your birthstones, a framed photo from a shared memory, or matching friendship bracelets. For the cousin you enjoy hanging out with, experience gifts like concert tickets, an escape room adventure, a spa day for two, or a cooking class create quality time together. If your cousin lives far away, consider a curated care package filled with local treats from your city, a cozy blanket, and a handwritten letter. For younger cousins, age-appropriate books, board games the whole family can enjoy, or a subscription box tailored to their interests are always safe bets. The best cousin gifts celebrate your unique bond.',
  },
  {
    question: 'What\'s the best practical gift you\'ve ever received (or given)?',
    answer:
      'The best practical gifts are those that solve a recurring annoyance or improve daily life in a small but meaningful way. Many people cite high-quality kitchen tools—like a razor-sharp chef\'s knife, a cast iron skillet, or an electric kettle with precise temperature control—as gifts they use nearly every day. Others mention premium basics such as a lightweight down jacket, a well-structured leather wallet, a durable travel backpack, or a set of 100% Egyptian cotton sheets that make bedtime feel luxurious. The most memorable practical gifts often combine utility with beauty: a hand-thrown ceramic mug that makes morning coffee feel special, a brass key organizer that eliminates pocket bulk, or a minimalist watch that goes with everything. The common thread is that these gifts show the giver paid attention to the recipient\'s daily habits and chose something that would genuinely make life easier or more pleasant.',
  },
  {
    question: 'What\'s your go-to gift for friends?',
    answer:
      'A go-to gift for friends should be universally appealing yet feel personalized. One excellent option is a high-quality consumable that aligns with their tastes: a bottle of small-batch gin or bourbon from a local distillery, a box of artisan chocolates from a renowned chocolatier, a bag of single-origin coffee beans with brewing notes, or a set of gourmet infused olive oils and balsamic vinegars. Another foolproof choice is an experience you can share, such as tickets to a comedy show, a voucher for a wine and cheese tasting, or a reservation at a trendy new restaurant in town. For friends who appreciate self-care, a curated candle from an indie maker, a set of bamboo skincare tools, or a subscription to a mindfulness app can feel thoughtful without being overly intimate. The key is choosing something that reflects their personality while keeping the gesture light, generous, and easy to receive.',
  },
  {
    question: 'What are some creative gifts?',
    answer:
      'Creative gifts break away from conventional presents by focusing on originality, personalization, and experiential value. DIY gift kits are wonderfully creative—think a build-your-own terrarium set, a sourdough starter kit with organic flour, a candle-making workshop in a box, or a paint-by-numbers kit featuring a custom photo. Personalized storybooks where the recipient is the main character, custom constellation maps of a significant date, or a playlist curated on a vintage cassette tape or USB drive embedded in a wooden case are deeply imaginative. Subscription boxes that deliver monthly surprises—like rare books, global snacks, or artisanal spices—keep the creativity going all year. For a truly unique approach, consider gifting a skill or experience: a private calligraphy lesson, a drone flying course, or a 23andMe ancestry kit that unlocks family history. Creative gifts show effort, imagination, and a willingness to think outside the gift-wrapped box.',
  },
  {
    question: 'How do I choose a unique gift?',
    answer:
      'Choosing a unique gift requires moving beyond generic categories and tapping into the recipient\'s specific personality, habits, and desires. Start by paying close attention to their conversations: what do they complain about, what do they geek out over, what do they save screenshots of? Use these clues to find something that addresses a need they have not expressed aloud. Avoid overly popular or trend-driven items; instead, seek out independent makers, artisan cooperatives, and small-batch producers who create objects with a story. Consider gifts that create an experience or a memory rather than just occupying shelf space—a workshop, a membership, a planned outing. Personalization is the easiest path to uniqueness: engraving, monogramming, or customizing a quality item transforms something ordinary into something irreplaceable. Finally, trust your instincts—if a gift makes you think, "This is so *them*," it is probably exactly the right unique choice.',
  },
  {
    question: 'What is the best gift to gift?',
    answer:
      'The best gift to give is one that demonstrates genuine understanding of the recipient. While this varies from person to person, universally beloved gifts share a few key qualities: they show the giver has listened and observed, they align with the recipient\'s genuine interests rather than the giver\'s assumptions, and they offer either lasting utility or a memorable experience. Timeless gift categories that consistently perform well include: high-quality versions of everyday items the recipient already uses (upgrading their daily experience), personalized keepsakes that mark your relationship (creating sentimental value), consumable luxuries they would not buy for themselves (adding indulgence without clutter), and shared experiences that strengthen your bond (building memories together). Ultimately, the best gift is not the most expensive or the most creative—it is the one that makes the recipient feel truly seen, understood, and valued.',
  },
  {
    question: 'What is the 4 gift idea?',
    answer:
      'The 4 gift idea (sometimes called the "Four Gift Rule") is a popular minimalist approach to gift-giving, especially during holidays like Christmas. The concept is simple: you give four gifts based on four categories—something they want, something they need, something to wear, and something to read. "Something they want" covers the fun, desire-driven item they have been eyeing (a video game, a gadget, a hobby item). "Something they need" focuses on practical, useful items (a new water bottle, a better backpack, kitchen tools). "Something to wear" includes clothing or accessories (a cozy sweater, a quality scarf, stylish sneakers). "Something to read" celebrates learning and imagination (a compelling novel, a beautiful coffee table book, an inspiring biography). This framework encourages thoughtful, intentional gifting while reducing excess and consumer clutter. It works beautifully for children, partners, and even adults who appreciate mindful consumption.',
  },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: `<p>${item.answer}</p>`,
    },
  })),
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq-section"
      className="max-w-4xl mx-auto py-16 border-t border-black/5 scroll-mt-28"
      aria-label="Frequently Asked Questions about Gift Giving"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      {/* Section Header */}
      <div className="space-y-4 mb-12 text-center">
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]">
          <HelpCircle className="w-4 h-4" />
          <span>Got Questions? We Have Answers</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-light italic text-[#1A1A1A]">
          Frequently Asked Questions About Gift Giving
        </h2>
        <p className="text-[15px] text-[#1A1A1A]/60 max-w-2xl mx-auto leading-relaxed">
          Browse our most common questions about finding the perfect gift for every person, occasion, and budget.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="divide-y divide-black/10 border-t border-b border-black/10">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="group"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 py-5 md:py-6 px-2 text-left cursor-pointer hover:bg-[#1A1A1A]/[0.02] transition-colors"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span
                  className="font-serif text-lg md:text-xl font-medium text-[#1A1A1A] leading-snug pr-4"
                  itemProp="name"
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#1A1A1A]/40 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div
                  className="px-2 text-[15px] text-[#1A1A1A]/80 leading-[1.8] space-y-3"
                  itemProp="text"
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Hint */}
      <div className="mt-10 text-center">
        <p className="text-sm text-[#1A1A1A]/50">
          Still looking for the perfect gift?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              const quizBtn = document.getElementById('btn-start-quiz-nav');
              if (quizBtn) quizBtn.click();
            }}
            className="text-[#1A1A1A] underline decoration-[#E2D1C3] decoration-2 underline-offset-4 hover:decoration-[#1A1A1A] transition-all font-medium"
          >
            Take our Gift Finder Quiz
          </a>{' '}
          for personalized recommendations.
        </p>
      </div>
    </section>
  );
}

