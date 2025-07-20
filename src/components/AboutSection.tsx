// src/components/AboutSection.tsx

export default function AboutSection() {
    return (
      <div id="about">
        <h2 className="section-title">About HashJing Project</h2>
        <div id="about-content" className="controls">
          <p>
            <strong>HashJing</strong> is a philosophical and aesthetic experiment at the intersection
            of generative art, cryptography, and East Asian symbolism. The name fuses “hash” (a unique
            digital fingerprint) with the Chinese character <strong>經</strong> <em>jīng</em> — “canonic text”.
            In other words, this is a “Canon of the Hash”: a deterministic structure where entropy gives rise to order.
          </p>
  
          <p>
            A full 256-bit hash is rendered as a <strong>mandala of 64 radial sectors and 4 concentric layers</strong>:
            one hex digit per sector, one bit per layer. For shorter 160-bit inputs (such as Ethereum addresses),
            the system draws 40 sectors using the same logic and visual grammar.
          </p>
  
          <p>
            This numerical-to-visual transformation raises a set of reflective questions: Can randomness produce symbolic form?
            Are cryptographic structures modern ideograms? Where is the boundary between entropy and canon?
            The system draws from the <strong>64 hexagrams of the I&nbsp;Ching</strong> and Daoist cosmology (Wújí → Tàijí)
            to connect contemporary data to a long tradition of contemplating pattern and change.
          </p>
  
          <p>This page includes:</p>
          <ul>
            <li>
              <strong>Mandala SVG</strong> — a visual representation generated from any 256- or 160-bit hash.
              Each bit of the hash determines a black or white segment within a 64- or 40-sector radial mandala.
              The result is a unique geometric fingerprint—an image born from entropy.
            </li>
            <li>
              <strong>Generate Mandala</strong> — an interactive interface that lets you create mandalas from
              custom hexadecimal hashes or arbitrary text input (which is hashed using SHA-256).
              Useful for both exploring patterns and testing specific values.
            </li>
            <li>
              <strong>Features of Order</strong> — automatic analysis of the hash structure: checks if the number of
              0s and 1s is perfectly balanced, counts “passages” (continuous paths from center to edge formed by zeros),
              and detects rare “sealed” configurations where no such path exists.
            </li>
          </ul>
  
          <p>
            For full mathematical and conceptual details, see the{' '}
            <a href="https://github.com/DataSattva/hashjing/blob/main/WhitePaper.ipynb" target="_blank" rel="noreferrer">
              WhitePaper
            </a>.
          </p>
        </div>
      </div>
    )
  }
  