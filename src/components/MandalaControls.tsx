// src/components/MandalaControls.tsx
import { generate } from '../utils/mandala'
import { Dispatch, RefObject, SetStateAction, useRef } from 'react'

interface Props {
  svgRef: RefObject<HTMLDivElement>
  hashBits: 256 | 160
  setHashBits: Dispatch<SetStateAction<256 | 160>>
  setCurrentHex: Dispatch<SetStateAction<string>> 
}

export function MandalaControls({ svgRef, hashBits, setHashBits, setCurrentHex }: Props) {
  const hashInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLTextAreaElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const handleGenerate = () =>
    generate({
      svgRef,
      bits: hashBits,
      hashInputRef,
      textInputRef,
      statusRef,
      onHex: setCurrentHex 
    })

  return (
    <div id="mandala-section">
      <h2 className="section-title">Generate Mandala</h2>
      <div id="mandala-controls" className="controls">
        
      <input
        ref={hashInputRef}
        placeholder="Enter 0x... custom hash (64 hex chars)"
        onChange={() => {
            if (hashInputRef.current?.value.trim()) {
            textInputRef.current!.value = ''
            }
        }}
        />

        <textarea
        ref={textInputRef}
        placeholder="Or enter text to hash..."
        rows={3}
        onChange={() => {
            if (textInputRef.current?.value.trim()) {
            hashInputRef.current!.value = ''
            }
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
              onChange={() => setHashBits(256)}
            />
            256-bit
          </label>
          <label>
            <input
              type="radio"
              name="hashBits"
              value="160"
              checked={hashBits === 160}
              onChange={() => setHashBits(160)}
            />
            160-bit
          </label>
        </div>
        <div ref={statusRef} id="status" className="status"></div>
        <button onClick={handleGenerate} className="wide-button green-button">
          Generate
        </button>
      </div>
    </div>
  )
}
