# giftideafor (```text
  giftideasforx.com
   ```)

giftideafor is a polished gift discovery experience built with Astro and React. The app helps users browse curated gift collections, save favorites, and take a guided quiz to receive personalized gift recommendations for different relationships, occasions, and personalities.

## What this project does

- Showcases curated gift inspiration cards for different recipients and occasions
- Lets users filter gift collections by category
- Includes a quiz-based recommendation flow for tailored gift suggestions
- Supports saving favorite cards, gift items, and recommended gifts locally in the browser
- Provides a responsive experience for desktop and mobile users

## Tech stack

- Astro 7
- React 19
- TypeScript
- Tailwind CSS
- Vite
- lucide-react and motion

## Project structure

- src/App.tsx: Main app state and page routing between gallery, saved items, and recommendations
- src/components/: Reusable UI sections such as the hero, quiz modal, recommendations page, and footer
- src/pages/: Astro pages and the recommendation API endpoint
- src/products.ts: Gift catalog used by the recommendation engine
- src/scoring.ts: Rule-based logic for ranking recommendations
- src/data.ts: Curated scrapbook cards and collections

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the app in your browser at:
   ```text
   http://localhost:3000
   ```

## Available scripts

- npm run dev: Start the local Astro development server
- npm run build: Build the project for production
- npm run preview: Preview the production build locally
- npm run lint: Run TypeScript checks

## Build

To create a production build:

```bash
npm run build
```

## Notes

The recommendation flow is powered by a local scoring engine in the app, using the product catalog and quiz answers to generate gift matches.
