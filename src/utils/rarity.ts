// src/utils/rarity.ts
// Rarity helpers for Passages (table-based) and Evenness (range-based).

export type HashBits = 256 | 160;

/* ───────── Evenness buckets (ratio 0.00–1.00) ─────────*/
// Evenness (0.00 – 1.00) → stars, continuous buckets
export function starsEvenness256(r: number): string {
  // defensive guard – mathematically unreachable but keeps noise out
  if (r < 0 || r > 1) return '★★★★★+';

  if (r >= 0.99) return '★★☆☆☆';   // 1.00 and hypothetical 0.99
  if (r >= 0.93) return '☆☆☆☆☆';   // modal right wing 0.93–0.98
  if (r >= 0.89) return '★☆☆☆☆';   // 0.89–0.92
  if (r >= 0.83) return '★★☆☆☆';   // 0.83–0.88
  if (r >= 0.78) return '★★★☆☆';   // 0.78–0.82
  if (r >= 0.72) return '★★★★☆';   // 0.72–0.77
  if (r >= 0.68) return '★★★★★';   // 0.68–0.71 (rare)
  return '★★★★★+';                 // < 0.68 (ultra-rare)
}

export function starsEvenness160(r: number): string {
  if (r < 0 || r > 1)  return '★★★★★+';
  if (r >= 0.99)       return '★★☆☆☆';
  if (r >= 0.95)       return '☆☆☆☆☆';
  if (r >= 0.90)       return '★☆☆☆☆';
  if (r >= 0.85)       return '★★☆☆☆';
  if (r >= 0.80)       return '★★★☆☆';
  if (r >= 0.75)       return '★★★★☆';
  if (r >= 0.70)       return '★★★★★';
  return '★★★★★+';
}

/* Re-use same mapping for 160-bit hashes until real stats collected */
export const stars256 = starsEvenness256; 
export const stars160 = starsEvenness160; 

/* ───────── Passages rarity tables ───────── */

/* ——— Passages rarity (256-bit) ——— */
const passages256 = {
  default: '★★★★★+',
  '0':  '★★★★★',
  '1':  '★★★★☆',
  '2':  '★★★☆☆',
  '3':  '★★☆☆☆',
  '4':  '★☆☆☆☆',
  '5':  '☆☆☆☆☆',  // most common
  '6':  '★☆☆☆☆',
  '7':  '★★☆☆☆',
  '8':  '★★★☆☆',
  '9':  '★★★★☆',
  '10': '★★★★★',
  '11': '★★★★★',  // explicit ultra-rare
} as const;

/* ——— Passages rarity (160-bit) ———
   thresholds shifted −1 (more passages on average) */
const passages160 = {
  default: '★★★★★+',
  '0':  '★★★★☆',
  '1':  '★★★☆☆',
  '2':  '★★☆☆☆',
  '3':  '★☆☆☆☆',
  '4':  '☆☆☆☆☆',  // mode
  '5':  '★☆☆☆☆',
  '6':  '★★☆☆☆',
  '7':  '★★★☆☆',
  '8':  '★★★★☆',
  '9':  '★★★★★',
} as const;

/* ───────── API ───────── */
/** Returns stars for a given trait value; uses ★★★★★+ for out-of-range. */
export function getRarityStars(
  trait: string,
  value: string | number | boolean,
  bits: HashBits,
): string | null {
  if (trait === 'Evenness') {
    const r = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(r)) return '★★★★★+';
    return bits === 256 ? stars256(r) : stars160(r);
  }

  const passages = bits === 256 ? passages256 : passages160;
  if (trait === 'Passages') {
    const str = String(value);
    return passages[str] ?? passages.default;
  }

  return null; // unknown trait
}
