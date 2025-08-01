// src/components/FeaturesSection.tsx
// Displays Evenness & Passages traits (with rarity stars) and the raw source hash.

import { countPassages } from "../utils/featureAnalysis"
import { getRarityStars } from "../utils/rarity"
import type { HashBits } from "../utils/featureAnalysis"
import { popcount } from '../utils/bitMath'

interface Props {
  hex: string;
  bits: HashBits;
}

export default function FeaturesSection({ hex, bits }: Props) {
  if (!hex) return null;

  /* ── trait values ── */
  const passages = countPassages(hex, bits);

  const ones   = popcount(hex);        // number of 1-bits
  const total  = bits;                 // 256 | 160
  const zeros  = total - ones;
  const ratio  = (Math.min(ones, zeros) / Math.max(ones, zeros)).toFixed(2); // "0.64"…"1.00"

  /* ── rarity lookup ── */
  const passagesStars = getRarityStars("Passages", passages, bits);
  const evenStars     = getRarityStars("Evenness", ratio, bits);

  return (
    <section className="mt-10">
      <h2 className="text-center text-2xl font-semibold tracking-tight mb-4">
        Features of Order
      </h2>

      {/* Evenness */}
      <div className="mb-1">
        <strong>Evenness:</strong> {ratio} | Rarity:{" "}
        <span className="text-2xl font-mono text-yellow-500">{evenStars}</span>
      </div>

      {/* Passages */}
      <div className="mb-3">
        <strong>Passages:</strong> {passages} | Rarity:{" "}
        <span className="text-2xl font-mono text-yellow-500">{passagesStars}</span>
      </div>

      {/* Raw hash */}
      <div>
        <strong>Source hash: </strong>
        <span className="break-words text-foreground">{hex}</span>
      </div>
    </section>
  );
}
