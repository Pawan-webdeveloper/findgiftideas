import type { APIRoute } from 'astro';
import { scoreProducts } from '../../scoring';
import { PRODUCT_CATALOG } from '../../products';
import type { QuizAnswers } from '../../types';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: QuizAnswers = await request.json();

    if (!body || !body.recipient || !body.occasion) {
      return new Response(
        JSON.stringify({ error: 'Missing required quiz answers.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Execute pure deterministic rule-based scoring engine
    const result = scoreProducts(body, PRODUCT_CATALOG, 5);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Recommendation Scoring Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate recommendations.',
        details: error.message || String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
