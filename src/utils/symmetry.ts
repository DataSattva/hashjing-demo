// Helpers to find radial symmetry patterns in the mandala grid.
// Comments must stay in English.

import type { HashBits } from './featureAnalysis';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface Symmetry {
  start:  number; // index of the first sector (0-based)
  length: number; // rank of the figure
  slice:  string; // the actual hexadecimal subsequence
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

/** Returns the list of *maximal* symmetries (nested ones removed). */
export function findSymmetries(hex: string, bits: HashBits): Symmetry[] {
  const grid    = hexToGrid(hex, bits);                // 4 × {64|40}
  const clean   = hex.startsWith('0x') ? hex.slice(2) : hex;
  const sectors = bits === 256 ? 64 : 40;

  const all: Symmetry[] = [];

  // brute-force all intervals of length ≥ 2 (no wrap‑around)
  for (let s = 0; s < sectors - 1; s++) {
    for (let len = 2; len <= sectors - s; len++) {
      if (isSegmentSymmetric(grid, s, len)) {
        all.push({ start: s, length: len, slice: clean.slice(s, s + len) });
      }
    }
  }
  return uniqMaxSymmetries(all);
}

/** Groups symmetries by rank: {2: 5, 3: 1, …}. */
export function symmetryRanks(hex: string, bits: HashBits): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const sym of findSymmetries(hex, bits)) {
    counts[sym.length] = (counts[sym.length] || 0) + 1;
  }
  return counts;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Checks whether the interval [start, …, start+len−1] is a palindrome in all 4 rings. */
function isSegmentSymmetric(grid: number[][], start: number, len: number): boolean {
  const half = len >> 1;
  for (let ring = 0; ring < 4; ring++) {
    const row = grid[ring];
    for (let k = 0; k < half; k++) {
      if (row[start + k] !== row[start + len - 1 - k]) return false;
    }
  }
  return true;
}

/** Converts hex hash to a 4 × {64|40} binary grid for flood‑fill / symmetry checks. */
function hexToGrid(hex: string, bits: HashBits): number[][] {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bin   = clean.split('').flatMap(h =>
    parseInt(h, 16).toString(2).padStart(4, '0').split('').map(Number),
  );

  const sectors = bits === 256 ? 64 : 40;
  const grid    = Array.from({ length: 4 }, () => Array(sectors).fill(0));

  for (let s = 0; s < sectors; s++)
    for (let r = 0; r < 4; r++)
      grid[r][s] = bin[s * 4 + r];

  return grid;
}

/** Keeps only maximal (non‑nested) palindromes, regardless of even/odd length. */
function uniqMaxSymmetries(sym: Symmetry[]): Symmetry[] {
  const keep: Symmetry[] = [];
  [...sym]
    .sort((a, b) => b.length - a.length) // longest → shortest
    .forEach(cand => {
      const covered = keep.some(s =>
        s.start <= cand.start && s.start + s.length >= cand.start + cand.length,
      );
      if (!covered) keep.push(cand);
    });
  return keep.sort((a, b) => a.start - b.start);
}
