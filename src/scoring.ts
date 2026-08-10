import type { Product, QuizAnswers, ScoredProduct, QuizResponse } from './types';

/**
 * Normalization maps for translating Quiz Option strings into normalized tag keys
 */
export function normalizeRelationship(answer?: string): string {
  if (!answer) return 'other';
  const val = answer.toLowerCase();
  if (val.includes('boyfriend')) return 'boyfriend';
  if (val.includes('girlfriend')) return 'girlfriend';
  if (val.includes('mom')) return 'mom';
  if (val.includes('dad')) return 'dad';
  if (val.includes('close friend')) return 'close_friend';
  if (val.includes('school') || val.includes('college')) return 'school_friend';
  if (val.includes('sibling')) return 'sibling';
  if (val.includes('grandparent') || val.includes('elder')) return 'grandparent';
  if (val.includes('coworker')) return 'coworker';
  return 'other';
}

export function normalizeOccasion(answer?: string): string {
  if (!answer) return 'just_because';
  const val = answer.toLowerCase();
  if (val.includes('birthday')) return 'birthday';
  if (val.includes('anniversary')) return 'anniversary';
  if (val.includes('just because')) return 'just_because';
  if (val.includes('milestone') || val.includes('achievement')) return 'milestone';
  if (val.includes('apologizing') || val.includes('making up')) return 'apology';
  if (val.includes('missing') || val.includes('long distance')) return 'missing_them';
  if (val.includes('goodbye')) return 'goodbye';
  if (val.includes('festival') || val.includes('holiday')) return 'holiday';
  if (val.includes('hard')) return 'hard_times';
  return 'just_because';
}

export function normalizeRelationshipStage(answer?: string): string {
  if (!answer) return 'general';
  const val = answer.toLowerCase();
  if (val.includes('just started')) return 'just_started';
  if (val.includes('few months')) return 'a_few_months';
  if (val.includes('long-term') || val.includes('settled')) return 'long_term';
  if (val.includes('long distance')) return 'long_distance';
  if (val.includes('forever')) return 'known_forever';
  if (val.includes('clicking')) return 'new_clicking';
  if (val.includes('reconnecting') || val.includes('drifted')) return 'reconnecting';
  if (val.includes('talk all the time') || val.includes('close')) return 'close';
  if (val.includes('love them but not super close')) return 'love_not_close';
  if (val.includes('complicated')) return 'complicated';
  return 'general';
}

export function normalizePersonality(answer?: string): string {
  if (!answer) return 'practical';
  const val = answer.toLowerCase();
  if (val.includes('planner')) return 'planner';
  if (val.includes('dreamer')) return 'dreamer';
  if (val.includes('adventurer')) return 'adventurer';
  if (val.includes('homebody')) return 'homebody';
  if (val.includes('aesthete')) return 'aesthete';
  if (val.includes('practical')) return 'practical';
  if (val.includes('jokester')) return 'jokester';
  return 'practical';
}

export function normalizeGiftLanguage(answer?: string): string {
  if (!answer) return 'physical_gift';
  const val = answer.toLowerCase();
  if (val.includes('words') || val.includes('gestures')) return 'words';
  if (val.includes('time') || val.includes('experiences')) return 'quality_time';
  if (val.includes('physical gift')) return 'physical_gift';
  if (val.includes('easier') || val.includes('service')) return 'acts_of_service';
  if (val.includes('surprises') || val.includes('spontaneity')) return 'surprises';
  return 'physical_gift';
}

export function getBudgetTierLevel(tierOrAnswer?: string): number {
  if (!tierOrAnswer) return 2; // default mid
  const val = tierOrAnswer.toLowerCase();
  if (val === 'modest' || val.includes('modest') || val.includes('under $25')) return 1;
  if (val === 'mid' || val.includes('mid') || val.includes('$25 - $50')) return 2;
  if (val === 'generous' || val.includes('generous') || val.includes('$50 - $100')) return 3;
  if (val === 'no_limit' || val.includes('no limit') || val.includes('$100+')) return 4;
  return 2;
}

export function getProductPriceTierLevel(tier: string): number {
  switch (tier) {
    case 'modest': return 1;
    case 'mid': return 2;
    case 'generous': return 3;
    case 'no_limit': return 4;
    default: return 2;
  }
}

/**
 * Single, pure, isolated scoring function for evaluating and ranking gifts deterministically.
 * 
 * POINT WEIGHTING:
 * - Relationship match: +3 points
 * - Occasion match: +3 points
 * - Personality match: +2 points
 * - Gift language match: +2 points
 * - Relationship stage match: +2 points (if product specifies stage constraints; +0 if agnostic)
 * 
 * DEPRIORITIZATION:
 * - Urgency "today" or "this week" with shippable product: -2 points
 * 
 * HARD FILTERS:
 * - Active flag === true
 * - Exclude relationships does not contain user relationship
 * - Budget tier "at or under" user budget limit
 * - Avoid category selection
 */
export function scoreProducts(
  answers: QuizAnswers,
  products: Product[],
  topN: number = 3
): QuizResponse {
  const normRel = normalizeRelationship(answers.recipient);
  const normOcc = normalizeOccasion(answers.occasion);
  const normStage = normalizeRelationshipStage(answers.relationshipStage);
  const normPers = normalizePersonality(answers.personality);
  const normLang = normalizeGiftLanguage(answers.appreciationStyle);
  const userBudgetLevel = getBudgetTierLevel(answers.budget);
  
  const isUrgent = answers.urgency
    ? answers.urgency.toLowerCase().includes('today') || answers.urgency.toLowerCase().includes('this week')
    : false;

  const avoidTerm = answers.avoid ? answers.avoid.toLowerCase() : '';

  // Helper evaluator that scores a list of products under given filter strictness parameters
  const evaluate = (
    maxBudgetLevelAllowed: number,
    applyDeliveryDeprioritization: boolean,
    strictAvoidFilter: boolean
  ): ScoredProduct[] => {
    const scored: ScoredProduct[] = [];

    for (const product of products) {
      // Hard Filter 1: Active status check
      if (!product.active) continue;

      // Hard Filter 2: Excluded relationships
      if (
        product.excludeRelationships &&
        product.excludeRelationships.includes(normRel)
      ) {
        continue;
      }

      // Hard Filter 3: Budget check ("at or under" logic)
      const pTierLevel = getProductPriceTierLevel(product.priceTier);
      if (pTierLevel > maxBudgetLevelAllowed) {
        continue;
      }

      // Hard Filter 4: Avoid items check
      if (strictAvoidFilter && avoidTerm && avoidTerm !== 'nothing specific') {
        if (product.productType) {
          const pType = product.productType.toLowerCase();
          if (
            (avoidTerm.includes('candle') && pType.includes('candle')) ||
            (avoidTerm.includes('mug') && pType.includes('mug')) ||
            (avoidTerm.includes('tech') && pType.includes('tech')) ||
            (avoidTerm.includes('clothes') && pType.includes('clothes')) ||
            (avoidTerm.includes('store') && pType.includes('storage'))
          ) {
            continue;
          }
        }
      }

      // Calculate score & overlap reasons
      let score = 0;
      const matchReasons: string[] = [];

      // Point 1: Relationship match (+3 points)
      if (product.relationships.includes(normRel)) {
        score += 3;
        matchReasons.push(`Relationship: ${answers.recipient || normRel}`);
      }

      // Point 2: Occasion match (+3 points)
      if (product.occasions.includes(normOcc)) {
        score += 3;
        matchReasons.push(`Occasion: ${answers.occasion || normOcc}`);
      }

      // Point 3: Personality match (+2 points)
      if (product.personalities.includes(normPers)) {
        score += 2;
        matchReasons.push(`Personality: ${normPers}`);
      }

      // Point 4: Gift Language / Appreciation Style match (+2 points)
      if (product.giftLanguage.includes(normLang)) {
        score += 2;
        matchReasons.push(`Appreciation style: ${normLang.replace('_', ' ')}`);
      }

      // Point 5: Relationship stage match (+2 points if stage-specific)
      if (product.relationshipStage && product.relationshipStage.length > 0) {
        if (product.relationshipStage.includes(normStage)) {
          score += 2;
          matchReasons.push(`Stage: ${normStage.replace('_', ' ')}`);
        }
      }

      // Deprioritization: Delivery timing (-2 points if shippable & user needs urgently)
      if (applyDeliveryDeprioritization && isUrgent && product.deliveryType === 'shippable') {
        score -= 2;
      }

      // Construct whyFits justification text
      let whyFits = `Matches user preferences for ${answers.recipient || 'them'} on ${answers.occasion || 'their special day'}.`;
      if (matchReasons.length > 0) {
        whyFits = `Hand-picked because it directly aligns with their ${normPers} personality and preferred ${normLang.replace('_', ' ')} gift style. (${matchReasons.join(', ')})`;
      }

      if (answers.wantsOrComplaints && answers.wantsOrComplaints.trim().length > 0) {
        whyFits += ` Note: User mentioned ("${answers.wantsOrComplaints.trim()}").`;
      }

      scored.push({
        ...product,
        score,
        matchReasons,
        whyFits,
      });
    }

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);
    return scored;
  };

  // Step 1: Default strict run
  let results = evaluate(userBudgetLevel, true, true);
  let appliedRelaxation: string | null = null;

  // Step 2: Fallback Relaxation Phase if < 3 products remain
  if (results.length < topN) {
    // Relaxation 1: Drop delivery timing deprioritization
    results = evaluate(userBudgetLevel, false, true);
    appliedRelaxation = 'Relaxed delivery timing deprioritization';

    if (results.length < topN) {
      // Relaxation 2: Widen budget match to next tier up
      results = evaluate(Math.min(userBudgetLevel + 1, 4), false, true);
      appliedRelaxation = 'Widened budget filter to next price tier';

      if (results.length < topN) {
        // Relaxation 3: Relax strict avoid filter
        results = evaluate(4, false, false);
        appliedRelaxation = 'Expanded search across all price tiers and categories';
      }
    }
  }

  const topRecommendations = results.slice(0, topN).map((item) => ({
    name: item.name,
    priceEstimate: item.priceEstimate || item.price,
    description: item.description,
    whyFits: item.whyFits,
    categoryTag: item.categoryTag || 'RECOMMENDED',
    image: item.image,
    link: item.link,
    score: item.score,
    matchReasons: item.matchReasons,
  }));

  const personalizedMessage = `Curated for a ${answers.recipient || 'loved one'} (${answers.relationshipStage || 'special bond'}) celebrating ${answers.occasion || 'a memorable occasion'}, matched precisely to their ${normPers} nature.`;

  return {
    recommendations: topRecommendations,
    personalizedMessage,
    appliedRelaxation,
  };
}
