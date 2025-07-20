# HashJing Demo

HashJing is a generative art experiment at the intersection of cryptography and East Asian symbolism.  
This repository contains an interactive page that renders SHA hashes as radial mandalas.

## Features

- Generate SVG mandalas from a hash or arbitrary text input
- Supports 256-bit and 160-bit hash formats
- Automatic feature analysis:
  - Bit balance (balanced/unbalanced)
  - Passage count from center to edge
  - Rare sealed configurations
- Download as SVG or PNG
- Responsive layout

## Local Development

```bash
npm install
npm run dev
```
Open in browser:
```
http://localhost:5175/hashjing-demo/

```

## Documentation

- White paper: [WhitePaper.ipynb](https://github.com/DataSattva/hashjing/blob/main/WhitePaper.ipynb)
- Live version: [datasattva.github.io/hashjing-demo](https://datasattva.github.io/hashjing-demo/)
    

## License

- Code: MIT
- Visuals: CC BY-NC 4.0
    