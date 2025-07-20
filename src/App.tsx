// src/App.tsx
import { useEffect, useRef, useState } from 'react'
import { generate, downloadSVG, downloadPNG } from './utils/mandala'
import { ContactBlock } from './components/ContactBlock'
import { MandalaControls } from './components/MandalaControls'
import AboutSection from './components/AboutSection'
import { useResponsiveSvg } from './hooks/useResponsiveSvg'


function App() {
  const svgRef = useRef<HTMLDivElement>(null)
  const [hashBits, setHashBits] = useState<256 | 160>(256)
  useResponsiveSvg(svgRef)

  useEffect(() => {
    generate({ svgRef, bits: hashBits })
  }, [hashBits])

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

      <MandalaControls hashBits={hashBits} setHashBits={setHashBits} svgRef={svgRef} />

      <div id="features">
        <h2 className="section-title">Features of Order</h2>
        <div id="features-content" className="controls"></div>
      </div>
      <AboutSection />
      <ContactBlock />
    </>
  )
}

export default App
