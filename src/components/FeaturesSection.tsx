// src/components/FeaturesSection.tsx
// Same functional logic; markup adjusted so that content is wrapped in
// <div id="features-content" className="controls"> to allow pure‑CSS alignment.

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

  // display strings
  const balancedVal   = balanced ? 'Yes' : 'No';
  const balancedStars = getRarityStars('Balanced', balancedVal);
  const passagesStars = getRarityStars('Passages', passages);

  // long descriptions (mint‑page wording)
  const balancedDesc = balanced
    ? 'Equal number of 0s and 1s in the hash, which occurs naturally in only ~5–6% of cases'
    : 'Unequal number of 0s and 1s; the more common state for hashes generated from entropy';

  const passageDesc = passages === 0
    ? 'No valid passage connects the center to the outer ring; all paths are blocked by “white walls”, forming a fully enclosed mandala (extremely rare).'
    : 'Continuous black-bit paths lead from the inner core to the edge, forming clear “exits”. These passages are isolated by white barriers preventing cross-travel.';

  return (
    <section id="features">
      <h2 className="section-title">Features of Order</h2>

      {/* Wrapper for easy CSS alignment */}
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
        </ul>
      </div>
    </section>
  );
}
