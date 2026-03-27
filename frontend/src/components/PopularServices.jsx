import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Clock, ChevronRight } from 'lucide-react'
import { fetchServices } from '../api/client'

function ServiceCard({ service, index }) {
  const navigate = useNavigate()
  const badgeClass = {
    'Bestseller': 'badge-bestseller',
    'Most Booked': 'badge-popular',
    'Top Rated': 'badge-green',
    'Popular': 'badge-popular',
  }[service.badge] || 'badge-primary'

  return (
    <div
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer',
        transition: 'var(--transition)', animation: `fadeInUp 0.5s ease ${index * 0.08}s both`,
      }}
      onClick={() => navigate(`/services/${service.id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '65%', overflow: 'hidden' }}>
        <img
          src={service.image}
          alt={service.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {service.badge && (
          <span className={`badge ${badgeClass}`} style={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}>
            {service.badge}
          </span>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
        }} />
        <span style={{
          position: 'absolute', bottom: 10, left: 12,
          fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
          background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-full)', padding: '3px 10px',
        }}>{service.category}</span>
      </div>

      {/* Content */}
      <div style={{ padding: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--text)', lineHeight: 1.3 }}>
          {service.name}
        </h3>
        <div style={{ display: 'flex', gap: 16, marginBottom: 14, fontSize: 13, color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={13} fill="#FBBf24" color="#FBBf24" />
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{service.rating}</span>
            <span>({service.reviews_count.toLocaleString()})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} />{service.duration}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>₹{service.price}</span>
            {service.original_price && (
              <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8, textDecoration: 'line-through' }}>
                ₹{service.original_price}
              </span>
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

export default function PopularServices() {
  const [services, setServices] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices().then(r => setServices((Array.isArray(r.data) ? r.data : r.data.services || []).slice(0, 6))).catch(() => {})
  }, [])

  return (
    <section className="section-py" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, rgba(124,58,237,0.05) 100%)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, marginBottom: 8 }}>
              Most Booked Services
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Our customers love these services</p>
          </div>
          <button onClick={() => navigate('/services')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>
      </div>
    </section>
  )
}
