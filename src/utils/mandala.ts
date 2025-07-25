// src/utils/mandala.ts

interface GenerateOptions {
    svgRef: React.RefObject<HTMLDivElement>
    bits: 256 | 160
    hashInputRef?: React.RefObject<HTMLInputElement>
    textInputRef?: React.RefObject<HTMLTextAreaElement>
    statusRef?: React.RefObject<HTMLDivElement>
  }

  import { renderFeatures } from './features'
  
  export function generate({ svgRef, bits, hashInputRef, textInputRef, statusRef }: GenerateOptions) {
    const hex = resolveInput(bits, hashInputRef, textInputRef, statusRef)
    if (!hex) return
    drawMandala(hex, bits, svgRef)
    renderFeatures(hex, bits)
  }
  
  function resolveInput(
    bits: 256 | 160,
    hashRef?: React.RefObject<HTMLInputElement>,
    textRef?: React.RefObject<HTMLTextAreaElement>,
    statusRef?: React.RefObject<HTMLDivElement>
  ): string | null {
    const expectedLength = bits / 4
    const rawHash = hashRef?.current?.value.trim() || ''
    const rawText = textRef?.current?.value.trim() || ''
    const isValidHash = /^0x[0-9a-fA-F]+$/.test(rawHash) && rawHash.length === 2 + expectedLength
    const useText = !!rawText
  
    let hex = ''
    const setStatus = (text: string, color = 'black') => {
      if (statusRef?.current) {
        statusRef.current.textContent = text
        statusRef.current.style.color = color
      }
    }
  
    if (useText) {
      if (hashRef?.current) hashRef.current.value = ''
      const buffer = new TextEncoder().encode(rawText)
      crypto.subtle.digest('SHA-256', buffer).then(hashBuffer => {
        const hexFull = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
        hex = '0x' + hexFull.slice(-expectedLength)
        setStatus(`Text input → SHA-256 → ${hex}`, 'green')
        drawMandala(hex, bits, svgRef!)
        renderFeatures(hex, bits)
      })
      return null
    } else if (isValidHash) {
      if (textRef?.current) textRef.current.value = ''
      hex = rawHash
      setStatus(`Using input hash: ${hex}`, 'green')
    } else {
      hex = generateRandomHash(bits)
      setStatus(`No valid input → using random: ${hex}`, 'red')
    }
    return hex
  }
  
  function generateRandomHash(bits: 256 | 160): string {
    const hex = '0123456789abcdef'
    const length = bits / 4
    let result = '0x'
    for (let i = 0; i < length; i++) {
      result += hex[Math.floor(Math.random() * 16)]
    }
    return result
  }
  
  export function drawMandala(hex: string, bits: 256 | 160, svgRef: React.RefObject<HTMLDivElement>) {
    const canvasSize = 1024
    const cx = canvasSize / 2
    const cy = canvasSize / 2
    const rings = 4
    const sectors = bits / 4
    const angleStep = (2 * Math.PI) / sectors
    const radiusStep = 80
    const baseRadius = 160
    const bitsArray = hexToBitArray(hex)
  
    const now = new Date().toISOString().split('T')[0]
    const metadata = `
      <metadata>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                 xmlns:dc="http://purl.org/dc/elements/1.1/">
          <dc:title>HashJing Mandala</dc:title>
          <dc:creator>DataSattva</dc:creator>
          <dc:description>Generative art based on cryptographic hash entropy and symbolic geometry.</dc:description>
          <dc:date>2025</dc:date>
          <dc:rights>MIT License (code); CC BY-NC 4.0 (visuals)</dc:rights>
          <dc:identifier>https://github.com/DataSattva/HashJing</dc:identifier>
          <dc:language>en</dc:language>
          <dc:format>image/svg+xml</dc:format>
          <dc:subject>generative art, mandala, hash, entropy, cryptography, I Ching</dc:subject>
        </rdf:RDF>
      </metadata>
      <desc>Generated with HashJing by DataSattva on ${now}</desc>
    `
  
    const signature = `<text x="${canvasSize - 10}" y="${canvasSize - 10}" font-size="18" fill="white" text-anchor="end" font-family="monospace" opacity="0.5">github.com/DataSattva/HashJing</text>`
    const bgRect = `<rect x="0" y="0" width="${canvasSize}" height="${canvasSize}" fill="black"/>`
    const paths = []
  
    for (let i = 0; i < sectors; i++) {
      const bin = bitsArray.slice(i * 4, (i + 1) * 4).reverse()
      for (let j = 0; j < rings; j++) {
        const path = generateSectorPath(cx, cy, i, j, angleStep, radiusStep, baseRadius)
        const fill = bin[j] === 1 ? 'white' : 'black'
        paths.push(`<path d="${path}" fill="${fill}" stroke="black" stroke-width="1"/>`)
      }
    }
  
    const lineLength = bits === 160 ? 10 : 16
    const square = hex.slice(2).match(new RegExp(`.{1,${lineLength}}`, 'g')) || []
    const textElements = square.map((line, i) =>
      `<text x="${cx}" y="${cy - 47 + i * 36}" font-size="22" fill="white" text-anchor="middle" font-family="monospace">${line}</text>`
    )
  
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 ${canvasSize} ${canvasSize}"
           preserveAspectRatio="xMidYMid meet">
        ${metadata}
        ${[bgRect, ...paths, ...textElements, signature].join('\n')}
      </svg>
    `
  
    svgRef.current!.innerHTML = svg
  }
  
  function hexToBitArray(hex: string): number[] {
    return hex.slice(2).split('').flatMap(h =>
      parseInt(h, 16).toString(2).padStart(4, '0').split('').map(Number)
    )
  }
  
  function generateSectorPath(cx: number, cy: number, i: number, j: number, angleStep: number, radiusStep: number, baseRadius: number): string {
    const angleStart = i * angleStep - Math.PI / 2
    const angleEnd = angleStart + angleStep
    const rInner = (3 - j) * radiusStep + baseRadius
    const rOuter = rInner + radiusStep
  
    const a0 = polarToCartesian(cx, cy, rInner, angleStart)
    const a1 = polarToCartesian(cx, cy, rInner, angleEnd)
    const b1 = polarToCartesian(cx, cy, rOuter, angleEnd)
    const b0 = polarToCartesian(cx, cy, rOuter, angleStart)
  
    return [
      `M ${a0.x} ${a0.y}`,
      `A ${rInner} ${rInner} 0 0 1 ${a1.x} ${a1.y}`,
      `L ${b1.x} ${b1.y}`,
      `A ${rOuter} ${rOuter} 0 0 0 ${b0.x} ${b0.y}`,
      'Z'
    ].join(' ')
  }
  
  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    }
  }
  
  export function downloadSVG() {
    const svg = document.querySelector('#svg-container svg')
    if (!svg) return
  
    const source = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
  
    const a = document.createElement('a')
    a.href = url
    a.download = 'hashjing-mandala.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  export function downloadPNG() {
    const svgElement = document.querySelector('#svg-container svg') as SVGSVGElement
    if (!svgElement) return
  
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
  
    const canvasSize = 1024
    const canvas = document.createElement('canvas')
    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext('2d')!
  
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize)
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize)
      URL.revokeObjectURL(url)
  
      const a = document.createElement('a')
      a.download = 'hashjing-mandala.png'
      a.href = canvas.toDataURL('image/png')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  
    img.crossOrigin = 'anonymous'
    img.src = url
  }
  