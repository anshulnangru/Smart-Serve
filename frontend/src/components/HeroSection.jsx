import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Shield, Clock, Star, ChevronRight, Zap } from 'lucide-react'

const QUICK_SERVICES = ['AC Repair', 'Home Cleaning', 'Salon at Home', 'Plumbing', 'Electrician', 'Deep Cleaning']

const TRUST_STATS = [
  { icon: '🛡️', label: 'Verified Pros', sub: 'Background checked' },
  { icon: '⏰', label: 'On-Time', sub: '98% punctuality' },
  { icon: '⭐', label: '4.8 Rating', sub: '5M+ reviews' },
  { icon: '💰', label: 'Best Prices', sub: 'Transparent pricing' },
]

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/services?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <section style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124,58,237,0.3) 0%, transparent 60%), var(--bg)',
      padding: '80px 0 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Left */}
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--primary-glow)', border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-full)', padding: '6px 16px',
              fontSize: 13, fontWeight: 600, color: 'var(--primary-light)',
              marginBottom: 24,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 8px var(--green)' }} />
              Trusted by 10M+ customers across India
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              marginBottom: 20,
            }}>
              Home services,<br />
              at your <span className="gradient-text">doorstep</span>
            </h1>

            <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Book expert professionals for all your home service needs. Quality service, transparent pricing, and happiness guaranteed.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', padding: 8, marginBottom: 16,
              boxShadow: 'var(--shadow-lg)',
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="input"
                    type="text"
                    placeholder="What service do you need?"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ paddingLeft: 44, height: 48, border: 'none', background: 'var(--bg-input)', fontSize: 15 }}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ height: 48, paddingLeft: 24, paddingRight: 24 }}>
                  Search
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, padding: '4px 6px' }}>
                {QUICK_SERVICES.map(s => (
                  <button key={s} type="button" onClick={() => setQuery(s)}
                    style={{
                      fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-full)',
                      padding: '4px 12px', transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => { e.target.style.color = 'var(--primary-light)'; e.target.style.borderColor = 'var(--primary)' }}
                    onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--border)' }}
                  >{s}</button>
                ))}
              </div>
            </form>

            {/* Trust badges row */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {TRUST_STATS.map(stat => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{stat.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{stat.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - floating service card preview */}
          <div style={{ position: 'relative', display: 'none', animation: 'fadeInUp 0.8s ease 0.2s both' }} className="hero-right">
            {/* Main card */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-2xl)', overflow: 'hidden',
              boxShadow: 'var(--shadow-glow)',
              animation: 'float 4s ease-in-out infinite',
            }}>
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=300&fit=crop"
                alt="Home Cleaning"
                style={{ width: '100%', height: 220, objectFit: 'cover' }}
              />
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Full Home Deep Cleaning</span>
                  <span className="badge badge-bestseller">Bestseller</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                    <Star size={14} fill="#FBBf24" color="#FBBf24" />
                    <span style={{ fontWeight: 600 }}>4.9</span>
                    <span style={{ color: 'var(--text-muted)' }}>(12.5k reviews)</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 800 }}>₹79</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6, textDecoration: 'line-through' }}>₹99</span>
                  </div>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Floating booking confirmed chip */}
            <div style={{
              position: 'absolute', top: -16, right: -16,
              background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: 'var(--radius-lg)', padding: '12px 16px',
              boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 10,
              animation: 'float 3.5s ease-in-out 0.5s infinite',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Booking Confirmed!</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AC Service · Tomorrow, 10 AM</div>
              </div>
            </div>

            {/* Floating pro chip */}
            <div style={{
              position: 'absolute', bottom: -16, left: -16,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '12px 16px',
              boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 10,
              animation: 'float 4s ease-in-out 1s infinite',
            }}>
              <img src="https://i.pravatar.cc/150?img=11" alt="Pro" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Rahul M.</div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#FBBf24" color="#FBBf24" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .hero-right { display: block !important; }
        }
        @media (max-width: 768px) {
          section > .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
