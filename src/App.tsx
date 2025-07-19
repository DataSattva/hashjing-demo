// src/App.tsx
import { useEffect, useState } from 'react'

function App() {
  const [RemoteBlock, setRemoteBlock] = useState<React.FC | null>(null)

  useEffect(() => {
    import('https://datasattva.github.io/hashjing-res/ContactBlock.js')
      .then((mod) => setRemoteBlock(() => mod.ContactBlock))
      .catch((err) => console.error('Failed to load ContactBlock:', err))
  }, [])

  return (
    <>
      <div id="title">
        <div>HashJing Live Demo</div>
      </div>

      <main>
        {RemoteBlock ? (
          <RemoteBlock />
        ) : (
          <p className="status">Loading contact block…</p>
        )}
      </main>
    </>
  )
}

export default App
