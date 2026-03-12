#!/usr/bin/env node
/**
 * Exports an Excel-friendly CSV: categories, list of duas, has audio, and link to the dua on the hosted site.
 * Run: node scripts/export-duas-audio-sheet.mjs
 * Output: duas-audio-inventory.csv (open in Excel or Sheets)
 */
const BASE_URL = "https://saarahasad.github.io/dua-journey";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const categories = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/categories.json"), "utf8")
);
const duas = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/duas.json"), "utf8")
);
const audioDir = path.join(root, "public/audio");
const audioFiles = fs.existsSync(audioDir)
  ? fs.readdirSync(audioDir).filter((f) => f.endsWith(".mp3"))
  : [];
const hasAudioSet = new Set(
  audioFiles.map((f) => path.basename(f, ".mp3"))
);

const categoryById = new Map(categories.map((c) => [c.id, c]));

// Sort duas by category order then by id
const categoryOrder = categories.map((c) => c.id);
const sortedDuas = [...duas].sort((a, b) => {
  const ai = categoryOrder.indexOf(a.categoryId);
  const bi = categoryOrder.indexOf(b.categoryId);
  if (ai !== bi) return ai - bi;
  return (a.id || "").localeCompare(b.id || "");
});

function escapeCsv(val) {
  const s = String(val ?? "");
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const header = ["Category", "Category ID", "Dua ID", "Dua Title", "Has Audio", "Link"];
const rows = sortedDuas.map((d) => {
  const cat = categoryById.get(d.categoryId);
  const link = `${BASE_URL}/dua/${d.id}`;
  return [
    escapeCsv(cat?.title ?? d.categoryId),
    escapeCsv(d.categoryId),
    escapeCsv(d.id),
    escapeCsv(d.title),
    hasAudioSet.has(d.id) ? "Yes" : "No",
    escapeCsv(link),
  ];
});

const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
const outPath = path.join(root, "duas-audio-inventory.csv");
fs.writeFileSync(outPath, "\uFEFF" + csv, "utf8"); // BOM for Excel
console.log("Wrote:", outPath);
console.log("Total duas:", duas.length, "| With audio:", hasAudioSet.size);
