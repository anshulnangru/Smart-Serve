import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, MapPin, Menu, X, ShoppingCart, User, LogOut, ChevronDown, Bell, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const CITIES = ['New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune']
const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Partner with us', href: '/partner' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [city, setCity] = useState('New Delhi')
  const [cityOpen, setCityOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const cityRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile on route change
  useEffect(() => setMobileOpen(false), [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15,15,26,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px var(--primary-glow)',
              fontSize: 16, fontWeight: 800, color: 'white',
            }}>S</div>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Smart<span style={{ color: 'var(--primary-light)' }}>Serve</span>
            </span>
          </Link>

          {/* City Selector */}
          <div ref={cityRef} style={{ position: 'relative', display: 'none' }} className="city-selector">
            <button
              onClick={() => setCityOpen(!cityOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 13, fontWeight: 500,
              }}
            >
              <MapPin size={14} color="var(--primary-light)" />
              {city}
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>
            {cityOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', minWidth: 160,
                boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 200,
              }}>
                {CITIES.map(c => (
                  <button key={c} onClick={() => { setCity(c); setCityOpen(false) }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 16px',
                      color: c === city ? 'var(--primary-light)' : 'var(--text)',
                      background: c === city ? 'var(--primary-glow)' : 'transparent',
                      fontSize: 13, fontWeight: 500, transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.target.style.background = c === city ? 'var(--primary-glow)' : 'transparent'}
                  >{c}</button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 400, display: 'none' }} className="search-bar">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                type="search"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 40, paddingRight: 16 }}
              />
            </div>
          </form>

          {/* Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.label} to={l.href}
                style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-md)',
                  color: location.pathname === l.href ? 'var(--primary-light)' : 'var(--text-muted)',
                  fontSize: 14, fontWeight: 500,
                  background: location.pathname === l.href ? 'var(--primary-glow)' : 'transparent',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => { e.target.style.color = 'var(--text)'; e.target.style.background = 'var(--bg-card)' }}
                onMouseLeave={e => {
                  e.target.style.color = location.pathname === l.href ? 'var(--primary-light)' : 'var(--text-muted)'
                  e.target.style.background = location.pathname === l.href ? 'var(--primary-glow)' : 'transparent'
                }}
              >{l.label}</Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    color: 'var(--text)', fontSize: 13, fontWeight: 600,
                  }}
                >
                  <img
                    src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`}
                    alt={user.name}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span className="hide-mobile">{user.name.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 8,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', minWidth: 200,
                    boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 200,
                    animation: 'scaleIn 0.2s ease',
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{user.email}</div>
                    </div>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'var(--text)', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/my-bookings" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'var(--text)', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Calendar size={15} /> My Bookings
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); navigate('/') }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'var(--red)', width: '100%', textAlign: 'left', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm hide-mobile">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
            {/* Mobile menu toggle */}
            <button className="btn btn-ghost btn-icon show-mobile" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-card)',
          padding: '16px',
          animation: 'fadeInUp 0.2s ease',
        }}>
          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type="search" placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} to={l.href} style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{l.label}</Link>
            ))}
          </div>
          {!user && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Link to="/login" className="btn btn-secondary" style={{ flex: 1 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .city-selector { display: block !important; }
          .search-bar { display: block !important; }
          .desktop-nav { display: flex !important; }
          .hide-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        .hide-mobile { display: none; }
        .show-mobile { display: flex; }
        .desktop-nav { display: none; }
      `}</style>
    </header>
  )
}
