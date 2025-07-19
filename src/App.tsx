// src/App.tsx
import { useEffect, useState } from 'react'

type ContactData = {
  email: string
  discord: string
  x: string[]
  demo_render: string
}

function App() {
  const [data, setData] = useState<ContactData | null>(null)

  useEffect(() => {
    fetch('https://datasattva.github.io/hashjing-res/res.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error loading contacts:', err))
  }, [])

  return (
    <>
      <div id="title">
        <div>HashJing Live Demo</div>
      </div>

      <main id="main-section">
        <div className="preview-container">
          {data ? (
            <div id="preview-section">
              <div className="section-title">Contacts</div>
              <p><strong>Email:</strong> <a href={`mailto:${data.email}`}>{data.email}</a></p>
              <p><strong>Discord:</strong> {data.discord}</p>
              <div>
                <strong>X (Twitter):</strong>
                <ul>
                  {data.x.map(x => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <p className="status">Loading contacts...</p>
          )}
        </div>
        <div className="preview-container">
          {data ? (
            <div id="preview-section">
              <div className="section-title">Resources</div>
              <p><strong>Live Demo:</strong> <a href={data.demo_render} target="_blank">{data.demo_render}</a></p>
            </div>
          ) : (
            <p className="status">Loading contacts...</p>
          )}
        </div>
      </main>
    </>
  )
}

export default App
