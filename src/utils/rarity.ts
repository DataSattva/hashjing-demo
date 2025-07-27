// src/utils/rarity.ts
// Separate rarity tables for 256-bit and 160-bit hashes
// with a fallback ★★★★★+ for out-of-range values.

const rarity256 = {
    Balanced: { Yes: '★★★★★', No: '★☆☆☆☆' },
    Passages: {
      default: '★★★★★+', // fallback for 12+ passages
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
  
  const rarity160 = {
    Balanced: { Yes: '★★★★☆', No: '★☆☆☆☆' },
    Passages: {
      default: '★★★★★+', // fallback for 9+ passages
      '0': '★★★★★',
      '1': '★★★★☆',
      '2': '★★★☆☆',
      '3': '★★☆☆☆',
      '4': '★☆☆☆☆',
      '5': '★☆☆☆☆',
      '6': '★☆☆☆☆',
      '7': '★★☆☆☆',
      '8': '★★★☆☆',
      '9': '★★★★☆',
      '10': '★★★★★',
    },
  } as const;
  
  export type HashBits = 256 | 160;
  
  /** Return stars string (bits-aware); uses ★★★★★+ for values beyond the table. */
  export function getRarityStars(
    trait: string,
    value: string | number | boolean,
    bits: HashBits,
  ): string | null {
    const table = bits === 256 ? rarity256[trait] : rarity160[trait];
    if (!table) return null;
  
    const stars = table[String(value)];
    return stars ?? table.default ?? '★★★★★+';
  }
  