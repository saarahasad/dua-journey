# Dua Journey

A mobile-first Islamic web app for memorising duas through guided presentation-style learning.

## Features

- **Calm, spiritual design** – Soft cream background, sage green accent, Amiri Arabic font
- **8-step memorisation flow** – Title → Story → Benefits → Phrase-by-phrase → Rebuild → Full view → Questions → When to read
- **localStorage** – Saves memorised status; no backend required
- **Scalable** – Add categories and duas via JSON only; no code changes needed

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Content

### Categories

Edit `src/data/categories.json`:

```json
{
  "id": "unique-id",
  "title": "Category Title",
  "description": "Short description.",
  "slug": "url-slug"
}
```

### Duas

Edit `src/data/duas.json`. See existing entries for the schema. Required fields:

- `id`, `categoryId`, `title`, `arabicFull`, `transliterationFull`, `translationFull`
- `intro`, `story`, `benefits` (array)
- `phrases` (array of `{ arabic, transliteration, meaning }`). Optional: `startTime` and `endTime` (seconds in the full audio) for phrase-synced playback in the phrase-by-phrase step.
- `questions` (array of `{ question, answer, explanation }`)
- `whenToRead` (`{ inSalah: string[], outsideSalah: string[] }`)

## Build

```bash
npm run build
```

Static output is in the `out/` folder (no server needed).

## Deploy to GitHub Pages

1. **Enable GitHub Pages**  
   In your repo: **Settings → Pages → Build and deployment**. Set **Source** to **GitHub Actions**.

2. **Push to trigger deploy**  
   Push to `main` or `master`; the workflow builds and deploys the app.  
   Your site will be at: `https://<username>.github.io/<repo-name>/`

3. **Local build with same paths as GitHub Pages** (optional):
   ```bash
   BASE_PATH=/your-repo-name npm run build
   ```
   Then serve the `out/` folder (e.g. `npx serve out`) and open `http://localhost:3000/your-repo-name/`.

**Note:** Ensure `package-lock.json` is committed so `npm ci` works in the workflow.
