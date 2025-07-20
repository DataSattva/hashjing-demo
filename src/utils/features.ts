// src/utils/features.ts

const visitedCache = {
    256: Array.from({ length: 4 }, () => Array(64).fill(false)),
    160: Array.from({ length: 4 }, () => Array(40).fill(false)),
  };
  
  export function renderFeatures(hex: string, bits: 256 | 160) {
    const el = document.getElementById('features-content');
    if (!el) return;
  
    const balanced = isBalanced(hex);
    const passages = countPassagesFromHex(hex, bits);
  
    const balanceText = balanced
      ? `<span style="color: green"><strong>Balanced</strong></span> — equal number of 0s and 1s in the hash, which occurs naturally in only ~5–6% of cases`
      : `<span style="color: black"><strong>Unbalanced</strong></span> — unequal number of 0s and 1s; the more common state for hashes generated from entropy`;
  
    const passageText = passages === 0
      ? `<span style="color: green"><strong>Sealed</strong></span> — no valid passage connects the center to the outer ring; all paths are blocked by “white walls”, forming a fully enclosed mandala (extremely rare).`
      : `<span style="color: black"><strong>${passages} passage${passages > 1 ? 's' : ''}</strong></span> — continuous black-bit paths lead from the inner core to the edge, forming clear “exits”. These passages are isolated by white barriers preventing cross-travel.`;
  
    el.innerHTML = `
      <ul style="padding-left: 1em; margin: 0;">
        <li>${balanceText}</li>
        <li>${passageText}</li>
      </ul>
    `;
  }
  
  export function isBalanced(hex: string): boolean {
    const bin = BigInt(hex).toString(2).padStart((hex.length - 2) * 4, '0');
    const zeros = [...bin].filter(b => b === '0').length;
    const ones = bin.length - zeros;
    return zeros === ones;
  }
  
  export function countPassagesFromHex(hexString: string, bits: 256 | 160): number {
    const grid = hexToGrid(hexString, bits);
    const rings = 4;
    const sectors = grid[0].length;
  
    const globalVisited = visitedCache[bits];
    for (let r = 0; r < rings; r++) globalVisited[r].fill(false);
  
    let passageCount = 0;
  
    for (let startSector = 0; startSector < sectors; startSector++) {
      if (grid[0][startSector] !== 0 || globalVisited[0][startSector]) continue;
  
      const queue = [[0, startSector]];
      const localVisited = Array.from({ length: rings }, () => Array(sectors).fill(false));
      const pathCells = [];
      let reachedEdge = false;
  
      while (queue.length) {
        const [r, s] = queue.shift()!;
        if (localVisited[r][s] || grid[r][s] !== 0) continue;
  
        localVisited[r][s] = true;
        pathCells.push([r, s]);
        if (r === rings - 1) reachedEdge = true;
  
        const neighbors = [
          [r + 1, s],
          [r - 1, s],
          [r, (s + 1) % sectors],
          [r, (s - 1 + sectors) % sectors],
        ];
  
        for (const [nr, ns] of neighbors) {
          if (
            nr >= 0 && nr < rings &&
            !localVisited[nr][ns] &&
            !globalVisited[nr][ns] &&
            grid[nr][ns] === 0
          ) {
            queue.push([nr, ns]);
          }
        }
      }
  
      if (reachedEdge) {
        passageCount++;
        for (const [r, s] of pathCells) globalVisited[r][s] = true;
      }
    }
  
    return passageCount;
  }
  
  function hexToGrid(hexString: string, bits: 256 | 160): number[][] {
    const clean = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    const binary = clean.split('').flatMap(h =>
      parseInt(h, 16).toString(2).padStart(4, '0').split('').map(Number)
    );
  
    const sectors = bits === 256 ? 64 : 40;
    const rings = 4;
    const grid = Array.from({ length: rings }, () => Array(sectors).fill(0));
  
    for (let s = 0; s < sectors; s++) {
      for (let r = 0; r < rings; r++) {
        grid[r][s] = binary[s * rings + r];
      }
    }
  
    return grid;
  }
  