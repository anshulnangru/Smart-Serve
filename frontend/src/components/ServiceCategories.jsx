import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategories } from '../api/client'

const CATEGORY_META = {
  cleaning:   { icon: '🧹', service_count: 8 },
  salon:      { icon: '💆', service_count: 7 },
  appliance:  { icon: '🔧', service_count: 6 },
  plumbing:   { icon: '🚿', service_count: 5 },
  electrical: { icon: '⚡', service_count: 5 },
  painting:   { icon: '🎨', service_count: 4 },
  pest:       { icon: '🐛', service_count: 4 },
  carpentry:  { icon: '🪚', service_count: 4 },
}

export default function ServiceCategories() {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : (r.data.categories || [])
        setCategories(data)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="section-py" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, marginBottom: 12 }}>
            What are you looking for?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Choose from 8 categories with 50+ services performed by expert professionals
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 16,
        }}>
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/services?category=${cat.id}`)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                cursor: 'pointer', transition: 'var(--transition)',
                animation: `fadeInUp 0.5s ease ${i * 0.06}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.background = 'var(--bg-card-hover)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 30px var(--primary-glow)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--bg-card)'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-input)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
              }}>
                {CATEGORY_META[cat.id]?.icon || '🏠'}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                   {CATEGORY_META[cat.id]?.service_count || ''} services
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
