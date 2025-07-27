// src/components/FeaturesSection.tsx
// Displays Balanced & Passages traits with rarity and shows the raw source hash.

import { isBalanced, countPassages } from '../utils/featureAnalysis';
import { getRarityStars } from '../utils/rarity';
import type { HashBits } from '../utils/featureAnalysis';

interface Props {
  hex: string;
  bits: HashBits;
}

export default function FeaturesSection({ hex, bits }: Props) {
  if (!hex) return null;

  // trait values
  const balanced = isBalanced(hex);
  const passages = countPassages(hex, bits);

  // display strings & rarity lookup (bits‑dependent)
  const balancedVal   = balanced ? 'Yes' : 'No';
  const balancedStars = getRarityStars('Balanced', balancedVal, bits);
  const passagesStars = getRarityStars('Passages', passages, bits);

  // descriptive text
  const balancedDesc = balanced
    ? 'Equal number of 0s and 1s in the hash, which occurs naturally in only ~5–6% of cases'
    : 'Unequal number of 0s and 1s; the more common state for hashes generated from entropy';

  const passageDesc = passages === 0
    ? 'No valid passage connects the center to the outer ring; all paths are blocked by “white walls”, forming a fully enclosed mandala (extremely rare).'
    : 'Continuous black‑bit paths lead from the inner core to the edge, forming clear “exits”. These passages are isolated by white barriers preventing cross‑travel.';

  return (
    <section id="features">
      <h2 className="section-title">Features of Order</h2>

      <div id="features-content" className="controls">
        <ul>
          <li>
            <strong>Balanced:</strong> {balancedVal}
            {balancedStars && (
              <span> | Rarity: <span className="rarity">{balancedStars}</span></span>
            )}
            <br />
            {balancedDesc}
          </li>

          <li>
            <strong>Passages:</strong> {passages}
            {passagesStars && (
              <span> | Rarity: <span className="rarity">{passagesStars}</span></span>
            )}
            <br />
            {passageDesc}
          </li>

          <li>
            <strong>Source hash:</strong> {hex}
          </li>
        </ul>
      </div>
    </section>
  );
}
