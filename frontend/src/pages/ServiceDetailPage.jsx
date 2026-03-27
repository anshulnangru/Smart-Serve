import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Clock, Shield, Users, ChevronRight, Check, ArrowLeft } from 'lucide-react'
import { fetchService, fetchReviews } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([fetchService(id), fetchReviews(id)])
      .then(([sRes, rRes]) => {
        setService(sRes.data)
        setReviews(Array.isArray(rRes.data) ? rRes.data : (rRes.data.reviews || []))
      })
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  )
  if (!service) return null

  const discount = service.original_price
    ? Math.round((1 - service.price / service.original_price) * 100)
    : 0

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
          {/* Left - Service detail */}
          <div>
            {/* Hero image */}
            <div style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', marginBottom: 28 }}>
              <img src={service.image} alt={service.name} style={{ width: '100%', height: 380, objectFit: 'cover' }} />
            </div>

            {/* Service info */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                {service.badge && <span className="badge badge-popular">{service.badge}</span>}
                <span className="badge badge-primary">{service.category}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
                {service.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                {service.description}
              </p>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={16} fill="#FBBf24" color="#FBBf24" />
                  <span style={{ fontWeight: 700 }}>{service.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({service.reviews_count.toLocaleString()} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                  <Clock size={16} /> {service.duration}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                  <Users size={16} /> {service.professionals_count}+ professionals
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)' }}>
                  <Shield size={16} /> Verified & insured
                </div>
              </div>
            </div>

            {/* What's included */}
            {service.includes?.length > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>What's Included</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {service.includes.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={14} color="var(--green)" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Customer Reviews</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 20 }}>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                        <img src={r.user_avatar} alt={r.user_name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{r.user_name}</div>
                          <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                            {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="#FBBf24" color="#FBBf24" />)}
                          </div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</div>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Booking widget (sticky) */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', padding: 28, boxShadow: 'var(--shadow-glow)' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 900 }}>₹{service.price}</span>
                  {service.original_price && (
                    <span style={{ fontSize: 16, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{service.original_price}
                    </span>
                  )}
                  {discount > 0 && (
                    <span style={{ fontSize: 14, color: 'var(--green)', fontWeight: 700 }}>
                      {discount}% off
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                  <Clock size={14} /> Duration: {service.duration}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 20 }}>
                {[
                  { icon: '✅', text: 'Professionals verified & background checked' },
                  { icon: '🔒', text: 'Secure payment & refund guarantee' },
                  { icon: '📞', text: '24/7 customer support' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  if (!user) { navigate('/login', { state: { redirect: `/services/${id}` } }); return }
                  navigate(`/book/${service.id}`)
                }}
              >
                Book This Service <ChevronRight size={18} />
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginTop: 12 }}>
                Free cancellation up to 2 hours before the appointment
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > .service-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
