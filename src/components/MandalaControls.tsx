// src/components/MandalaControls.tsx

import { generate } from '../utils/mandala';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useRef,
} from 'react';

interface Props {
  svgRef: RefObject<HTMLDivElement>;
  hashBits: 256 | 160;
  setHashBits: Dispatch<SetStateAction<256 | 160>>;
  setCurrentHex: Dispatch<SetStateAction<string>>;
  statusRef?: RefObject<HTMLDivElement>; // optional: shared from App
}

export function MandalaControls({
  svgRef,
  hashBits,
  setHashBits,
  setCurrentHex,
  statusRef,
}: Props) {
  const hashInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // create local fallback if parent did not supply one
  const localStatusRef = useRef<HTMLDivElement>(null);
  const effectiveStatusRef = statusRef ?? localStatusRef;

  const runGenerate = (bits: 256 | 160) =>
    generate({
      svgRef,
      bits,
      hashInputRef,
      textInputRef,
      statusRef: effectiveStatusRef,
      onHex: setCurrentHex,
    });

  const handleGenerate = () => runGenerate(hashBits);

  const handleBitsChange = (bits: 256 | 160) => {
    setHashBits(bits);
    runGenerate(bits);
  };

  return (
    <div id="mandala-section">
      <h2 className="section-title">Generate Mandala</h2>
      <div id="mandala-controls" className="controls">
        <input
          ref={hashInputRef}
          placeholder="Enter 0x... custom hash (64 hex chars)"
          onChange={() => {
            if (hashInputRef.current?.value.trim()) textInputRef.current!.value = '';
          }}
        />

        <textarea
          ref={textInputRef}
          placeholder="Or enter text to hash..."
          rows={3}
          onChange={() => {
            if (textInputRef.current?.value.trim()) hashInputRef.current!.value = '';
          }}
        />

        <div className="hash-type-inline">
          <span>Hash type:</span>
          <label>
            <input
              type="radio"
              name="hashBits"
              value="256"
              checked={hashBits === 256}
              onChange={() => handleBitsChange(256)}
            />
            256-bit
          </label>
          <label>
            <input
              type="radio"
              name="hashBits"
              value="160"
              checked={hashBits === 160}
              onChange={() => handleBitsChange(160)}
            />
            160-bit
          </label>
        </div>

        <div ref={effectiveStatusRef} id="status" className="status" />
        <button onClick={handleGenerate} className="wide-button green-button">
          Generate
        </button>
      </div>
    </div>
  );
}

export default MandalaControls;
