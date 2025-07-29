// src/App.tsx
import { useEffect, useRef, useState } from 'react';
import { generate, downloadSVG, downloadPNG } from './utils/mandala';
import { ContactBlock } from './components/ContactBlock';
import { MandalaControls } from './components/MandalaControls';
import AboutSection from './components/AboutSection';
import IncludesSection from './components/IncludesSection';
import { useResponsiveSvg } from './hooks/useResponsiveSvg';
import FeaturesSection from './components/FeaturesSection';


function App() {
  const svgRef = useRef<HTMLDivElement>(null);
  const [hashBits, setHashBits] = useState<256 | 160>(256);
  const [currentHex, setCurrentHex] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);
  const hashInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const handleGenerate = () => {
    generate({
      svgRef,
      bits: hashBits,
      hashInputRef,
      textInputRef,
      statusRef,
      onHex: setCurrentHex,
    })
  }  

  useResponsiveSvg(svgRef);

  useEffect(() => {
    generate({
      svgRef,
      bits: hashBits,  
      statusRef,   
      onHex: setCurrentHex,
    });
  }, []);
  
  return (
    <>
      <div
        className="sticky top-0 z-10 w-full py-3 text-center text-3xl font-bold bg-background border-b border-gray-300"
      >
        HashJing Generate
      </div>
      <div
        id="svg-container"
        ref={svgRef}
        onClick={handleGenerate}
        className="w-screen flex justify-center overflow-hidden mt-0 mb-4 cursor-pointer"
      >
      </div>
  
      <main className="mx-auto max-w-screen-md px-4 space-y-8">
        <div id="download-buttons" className="flex justify-center gap-4">
          <button
            onClick={downloadSVG}
            className="text-sm border border-gray-300 px-3 py-1 rounded hover:border-gray-500 transition cursor-pointer "
          >
            Download SVG
          </button>
          <button
            onClick={downloadPNG}
            className="text-sm border border-gray-300 px-3 py-1 rounded hover:border-gray-500 transition cursor-pointer "
          >
            Download PNG
          </button>
        </div>
  
        <MandalaControls
          svgRef={svgRef}
          hashBits={hashBits}
          setHashBits={setHashBits}
          setCurrentHex={setCurrentHex}
          statusRef={statusRef}
          hashInputRef={hashInputRef}
          textInputRef={textInputRef}
          onGenerate={handleGenerate}
        />
        <FeaturesSection hex={currentHex} bits={hashBits} />
        <IncludesSection />
        <AboutSection />
        <ContactBlock />
      </main>
    </>
  )  
}

export default App
