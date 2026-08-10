export interface GiftItem {
  id: string;
  name: string;
  price: string;
  description: string;
  link: string;
  image?: string;
}

export interface ScrapbookCard {
  id: string;
  title: string;
  picksCount: number;
  badgeBg: string;
  badgeText: string;
  image: string;
  description: string;
  category: string; // 'recent' | 'occasions' | 'recipients' | 'sustainability'
  tags: string[];
  items: GiftItem[];
}

export interface QuizAnswers {
  recipient: string;
  occasion: string;
  relationshipStage: string;
  personality: string;
  wantsOrComplaints?: string;
  avoid: string;
  appreciationStyle: string;
  budget: string;
  urgency: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  priceEstimate?: string;
  description: string;
  image: string;
  link?: string;
  categoryTag?: string;
  productType?: 'Candles' | 'Mugs' | 'Generic tech gadgets' | 'Clothes' | 'Storage' | 'Other';

  // Part 1 - Tagging schema fields
  relationships: string[]; // e.g. ["boyfriend", "close_friend", "mom"]
  excludeRelationships?: string[]; // optional
  occasions: string[]; // e.g. ["birthday", "anniversary", "just_because"]
  personalities: string[]; // e.g. ["planner", "dreamer", "adventurer", "homebody", "aesthete", "practical", "jokester"]
  giftLanguage: string[]; // e.g. ["words", "quality_time", "physical_gift", "acts_of_service", "surprises"]
  priceTier: 'modest' | 'mid' | 'generous' | 'no_limit';
  relationshipStage?: string[]; // e.g. ["new_relationship", "long_term", "long_distance"]
  deliveryType: 'shippable' | 'instant';
  active: boolean;
}

export interface ScoredProduct extends Product {
  score: number;
  matchReasons: string[];
  whyFits: string;
}

export interface RecommendedGift {
  name: string;
  priceEstimate: string;
  description: string;
  whyFits: string;
  categoryTag: string;
  image?: string;
  link?: string;
  score?: number;
  matchReasons?: string[];
}

export interface QuizResponse {
  recommendations: RecommendedGift[];
  personalizedMessage: string;
  appliedRelaxation?: string | null;
}

export interface EventReminder {
  id: string;
  eventName: string;
  recipientName: string;
  occasion: string;
  eventDate: string;
  timing: '1_week_before' | '3_days_before' | 'on_day';
  email: string;
  createdAt: string;
}

export interface UserStory {
  id: string;
  authorName: string;
  authorRole: string; // e.g., "Purchased for Long-Distance Partner"
  recipient: string;
  occasion: string;
  matchedGift: string;
  giftPrice: string;
  rating: number; // 1-5
  storyText: string;
  impactOutcome: string; // e.g. "She actually cried when opening it!"
  category: 'romance' | 'family' | 'friends' | 'milestones';
  image?: string;
  dateAgo: string;
  verified: boolean;
}

