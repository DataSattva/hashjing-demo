// src/utils/rarity.ts
// Constant rarity table based on empirical data
// and helper to map trait/value → stars string.

export const rarityStars: Record<string, Record<string, string>> = {
    Balanced: {
      Yes: '★★★★☆',
      No:  '★☆☆☆☆',
    },
    Passages: {
      '0':  '★★★★★',
      '1':  '★★★★★',
      '2':  '★★★★☆',
      '3':  '★★★☆☆',
      '4':  '★★☆☆☆',
      '5':  '★★☆☆☆',
      '6':  '★★☆☆☆',
      '7':  '★★★☆☆',
      '8':  '★★★★☆',
      '9':  '★★★★★',
      '10': '★★★★★',
      '11': '★★★★★',
    },
  } as const;
  
  /** Return stars string or null when not defined. */
  export function getRarityStars(
    trait: string,
    value: string | number | boolean,
  ): string | null {
    const table = rarityStars[trait];
    return table ? table[String(value)] ?? null : null;
  }
  