// src/components/FeaturesSection.tsx
// Displays Balanced & Passages traits with rarity and shows the raw source hash.

import { isBalanced, countPassages } from '../utils/featureAnalysis'
import { getRarityStars } from '../utils/rarity'
import type { HashBits } from '../utils/featureAnalysis'
import { InfoTooltip } from "@/components/InfoTooltip"


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
    <section className="space-y-4 mt-10">
      <h2 className="text-center text-2xl font-semibold tracking-tight">
        Features of Order
      </h2>
  
      <ul className="space-y-2 leading-relaxed">
        <li>
          <strong>Balanced:</strong> {balancedVal}
          {balancedStars && (
            <span>
              {" "}
              | Rarity:{" "} 
              <span className="text-2xl font-mono text-yellow-500">{balancedStars}</span>
              
              <InfoTooltip>
                Stars indicate the rarity of the feature across all possible hashes.
                <br />
                <a
                  href="https://github.com/DataSattva/hashjing-demo"
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  View rarity chart →
                </a>
              </InfoTooltip>

            </span>
          )}
          <br />
          <span className="text-muted-foreground">{balancedDesc}</span>
        </li>
  
        <li>
          <strong>Passages:</strong> {passages}
          {passagesStars && (
            <span>
              {" "}
              | Rarity:{" "}
              <span className="text-2xl font-mono text-yellow-500">{passagesStars}</span>

              <InfoTooltip>
                Stars indicate the rarity of the feature across all possible hashes.
                <br />
                <a
                  href="https://github.com/DataSattva/hashjing-demo"
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  View rarity chart →
                </a>
              </InfoTooltip>
              
            </span>
          )}
          <br />
          <span className="text-muted-foreground">{passageDesc}</span>
        </li>
  
        <li>
          <strong>Source hash:</strong>
          <div className="break-words font-mono text-sm text-foreground mt-1">
            {hex}
          </div>
        </li>
      </ul>
    </section>
  );  
}
