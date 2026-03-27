import { useNavigate } from 'react-router-dom'
import { Smartphone, Apple, Star, Users, Zap } from 'lucide-react'

const STATS = [
  { icon: <Users size={20} />, value: '10M+', label: 'Customers' },
  { icon: <Star size={20} fill="#FBBf24" color="#FBBf24" />, value: '4.8', label: 'App Rating' },
  { icon: <Zap size={20} />, value: '50+', label: 'Services' },
]

export default function AppPromo() {
  const navigate = useNavigate()
  return (
    <section className="section-py" style={{
      background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(16,185,129,0.08) 100%), var(--bg)',
    }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-dark), var(--primary), var(--primary-light))',
          borderRadius: 'var(--radius-2xl)', padding: '64px 56px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px var(--primary-glow)',
        }} className="app-promo-grid">
          {/* Background decorations */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -80, right: 100, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
              Book services on the go!
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 36, maxWidth: 380 }}>
              Download the SmartServe app and get access to 50+ services, real-time tracking, exclusive app-only discounts, and 24/7 support.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              {[
                { icon: <Apple size={20} />, store: 'App Store', sub: 'Available on', badge: '4.8 ★' },
                { icon: <Smartphone size={20} />, store: 'Google Play', sub: 'Get it on', badge: '4.7 ★' },
              ].map(btn => (
                <button key={btn.store}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 'var(--radius-lg)', padding: '12px 20px',
                    color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  {btn.icon}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{btn.sub}</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{btn.store}</div>
                  </div>
                  <span style={{ marginLeft: 4, fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                    {btn.badge}
                  </span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - phone mockup */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-block', position: 'relative', animation: 'float 3s ease-in-out infinite' }}>
              <div style={{
                width: 200, height: 380, borderRadius: 36,
                background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 20,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}>S</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>SmartServe</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Home Services</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px' }}>
                  {['🧹', '💆', '🔧', '⚡', '🚿', '🎨'].map(em => (
                    <span key={em} style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{em}</span>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/services')}
                  style={{ background: 'white', color: 'var(--primary)', borderRadius: 20, padding: '8px 24px', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .app-promo-grid { grid-template-columns: 1fr !important; padding: 36px 24px !important; }
        }
      `}</style>
    </section>
  )
}
