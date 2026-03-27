import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Star, Clock, Filter, X, ChevronRight } from 'lucide-react'
import { fetchServices, fetchCategories } from '../api/client'

function ServiceCard({ service }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/services/${service.id}`)}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer',
        transition: 'var(--transition)', display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
        <img src={service.image} alt={service.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        {service.badge && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'var(--primary)', color: 'white',
            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)',
          }}>{service.badge}</span>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
        }} />
        <span style={{
          position: 'absolute', bottom: 8, left: 12,
          fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
          background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-full)', padding: '2px 10px',
        }}>{service.category}</span>
      </div>
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{service.name}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.6, flex: 1 }}>
          {service.description.substring(0, 80)}...
        </p>
        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={12} fill="#FBBf24" color="#FBBf24" />
            <b style={{ color: 'var(--text)' }}>{service.rating}</b> ({service.reviews_count.toLocaleString()})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={12} />{service.duration}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 17 }}>₹{service.price}</span>
            {service.original_price && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6, textDecoration: 'line-through' }}>₹{service.original_price}</span>
            )}
          </div>
          <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/services/${service.id}`) }}>
            Book
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    fetchCategories().then(r => setCategories(Array.isArray(r.data) ? r.data : (r.data.categories || []))).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeCategory) params.category = activeCategory
    if (search) params.search = search
    fetchServices(params)
      .then(r => setServices(Array.isArray(r.data) ? r.data : (r.data.services || [])))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeCategory, search])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = e.target.elements.search.value
    setSearch(q)
    setSearchParams(q ? { search: q } : {})
  }

  const handleCategory = (catId) => {
    const next = catId === activeCategory ? '' : catId
    setActiveCategory(next)
    setSearch('')
    setSearchParams(next ? { category: next } : {})
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0.05) 100%)',
        borderBottom: '1px solid var(--border)', padding: '40px 0 0',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>All Services</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>50+ services · Verified professionals · Best prices</p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ maxWidth: 540, marginBottom: 28 }}>
            <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="search" className="input" placeholder="Search services..." defaultValue={search}
                  style={{ paddingLeft: 40 }} />
              </div>
              <button type="submit" className="btn btn-primary">Search</button>
              {(search || activeCategory) && (
                <button type="button" className="btn btn-ghost" onClick={() => { setSearch(''); setActiveCategory(''); setSearchParams({}) }}>
                  <X size={16} /> Clear
                </button>
              )}
            </div>
          </form>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none' }}>
            <button onClick={() => handleCategory('')} className={`pill ${!activeCategory ? 'active' : ''}`}>All Services</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => handleCategory(cat.id)}
                className={`pill ${activeCategory === cat.id ? 'active' : ''}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container section-py-sm">
        {/* Results count */}
        <div style={{ marginBottom: 24, color: 'var(--text-muted)', fontSize: 14 }}>
          {loading ? 'Loading...' : `${services.length} services found${activeCategory ? ` in ${categories.find(c => c.id === activeCategory)?.name || ''}` : ''}${search ? ` for "${search}"` : ''}`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No services found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Try a different search or browse all categories</p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setActiveCategory(''); setSearchParams({}) }}>
              Browse All Services
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {services.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
