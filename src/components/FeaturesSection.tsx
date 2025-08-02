// src/components/FeaturesSection.tsx
// Displays Evenness, Passages, Symmetries traits and the raw source hash.

import { countPassages } from "../utils/featureAnalysis";
import { popcount }       from "../utils/bitMath";
import { getRarityStars } from "../utils/rarity";
import type { HashBits }  from "../utils/featureAnalysis";
import { findSymmetries, symmetryRanks } from "../utils/symmetry";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


interface Props {
  hex: string;
  bits: HashBits;
  showSymmetries: boolean;
  setShowSymmetries: (value: boolean) => void;
}

export default function FeaturesSection({
  hex,
  bits,
  showSymmetries,
  setShowSymmetries,
}: Props) {
  if (!hex) return null;

  /* —— trait values —— */
  const passages = countPassages(hex, bits);

  const ones   = popcount(hex);             // number of 1-bits
  const total  = bits;                      // 256 | 160
  const zeros  = total - ones;
  const ratio  = (Math.min(ones, zeros) / Math.max(ones, zeros)).toFixed(2);

  // symmetry statistics
  const symList  = findSymmetries(hex, bits);
  const symRanks = symmetryRanks(hex, bits); // {rank: count}

  /* —— rarity lookup —— */
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

      {/* Symmetries */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center justify-between gap-4">
          <div>
            <strong>Symmetries:</strong> {symList.length} total | Ranks:{" "}
            {Object.entries(symRanks)
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([rank, count]) => `${rank}:${count}`)
              .join(", ")}
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="sym-toggle">Show</Label>
            <Switch
              id="sym-toggle"
              checked={showSymmetries}
              onCheckedChange={setShowSymmetries}
            />
          </div>
        </div>
      </div>

      {/* Raw hash */}
      <div>
        <strong>Source hash: </strong>
        <span className="break-words text-foreground">{hex}</span>
      </div>
    </section>
  );
}
