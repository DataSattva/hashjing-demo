// src/components/ContactBlock.tsx
import { useEffect, useState } from 'react'

interface ContactData {
  email: string
  discord: string
  x: string[]
  demo_render: string
}

export const ContactBlock = () => {
  const [data, setData] = useState<ContactData | null>(null)

  useEffect(() => {
    fetch('https://datasattva.github.io/hashjing-res/res.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error loading contacts:', err))
  }, [])

  if (!data) return <p className="status">Loading contacts…</p>

  return (
    <main id="main-section">
      <div className="preview-container">
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
      </div>

      <div className="preview-container">
        <div id="preview-section">
          <div className="section-title">Resources</div>
          <p><strong>Live Demo:</strong> <a href={data.demo_render} target="_blank" rel="noreferrer">{data.demo_render}</a></p>
        </div>
      </div>
    </main>
  )
}
