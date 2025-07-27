// src/App.tsx
import { useEffect, useRef, useState } from 'react'
import { generate, downloadSVG, downloadPNG } from './utils/mandala'
import { ContactBlock } from './components/ContactBlock'
import { MandalaControls } from './components/MandalaControls'
import AboutSection from './components/AboutSection'
import { useResponsiveSvg } from './hooks/useResponsiveSvg'
import FeaturesSection from './components/FeaturesSection';


function App() {
  const svgRef = useRef<HTMLDivElement>(null);
  const [hashBits, setHashBits] = useState<256 | 160>(256);
  const [currentHex, setCurrentHex] = useState('')
  useResponsiveSvg(svgRef);

  useEffect(() => {
    generate({ svgRef, bits: hashBits, onHex: setCurrentHex });
  }, [hashBits]);

  return (
    <>
      <div id="title">HashJing Demo</div>

      <div id="about-link">
        <a href="#about">About HashJing Project</a>
      </div>

      <div id="svg-container" ref={svgRef}></div>

      <div id="download-buttons">
        <button onClick={downloadSVG}>Download SVG</button>
        <button onClick={downloadPNG}>Download PNG</button>
      </div>

      <MandalaControls
        svgRef={svgRef}
        hashBits={hashBits}
        setHashBits={setHashBits}
        setCurrentHex={setCurrentHex}
      />
      <FeaturesSection hex={currentHex} bits={hashBits} />
      <AboutSection />
      <ContactBlock />
    </>
  )
}

export default App
