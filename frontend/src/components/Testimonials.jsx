import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'New Delhi',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    service: 'Home Deep Cleaning',
    comment: 'Absolutely amazing service! The team was professional, on time, and my house looks brand new. The attention to detail was incredible. Will definitely book again!',
  },
  {
    id: 2,
    name: 'Vikram Kumar',
    location: 'Bangalore',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    service: 'AC Service & Repair',
    comment: 'AC is running like new! The technician explained everything clearly and was very professional. The app experience was smooth and the professional arrived right on time.',
  },
  {
    id: 3,
    name: 'Sunita Rao',
    location: 'Mumbai',
    avatar: 'https://i.pravatar.cc/150?img=7',
    rating: 5,
    service: 'Classic Facial & Cleanup',
    comment: 'Brilliant facial! The beautician was skilled and used quality products. My skin feels amazing. Saved me the hassle of going to a salon. 10/10 would recommend!',
  },
  {
    id: 4,
    name: 'Rohit Verma',
    location: 'Hyderabad',
    avatar: 'https://i.pravatar.cc/150?img=2',
    rating: 5,
    service: 'Plumbing - Leak Repair',
    comment: 'Fixed the leak in no time! The plumber was courteous, skilled and left no mess. Transparent pricing — what was quoted is exactly what I paid. Superb!',
  },
  {
    id: 5,
    name: 'Kavitha M',
    location: 'Chennai',
    avatar: 'https://i.pravatar.cc/150?img=8',
    rating: 5,
    service: 'Full Body Massage',
    comment: 'Best home massage experience ever! The therapist was professional and the aromatherapy oils were divine. Felt completely relaxed and rejuvenated afterward.',
  },
]

export default function Testimonials() {
  const [curr, setCurr] = useState(0)

  const prev = () => setCurr((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1))
  const next = () => setCurr((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1))
  const t = TESTIMONIALS[curr]

  return (
    <section className="section-py" style={{ background: 'var(--bg-card)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, marginBottom: 12 }}>
            What Our Customers Say
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>5 million+ happy customers across India</p>
        </div>

        {/* Featured testimonial */}
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)', padding: '48px 56px',
            boxShadow: 'var(--shadow-glow)',
            textAlign: 'center',
            animation: 'scaleIn 0.3s ease',
            key: curr,
          }}>
            <Quote size={40} color="var(--primary)" style={{ margin: '0 auto 24px', opacity: 0.6 }} />
            <p style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--text)', marginBottom: 32, fontStyle: 'italic', fontWeight: 400 }}>
              "{t.comment}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <img src={t.avatar} alt={t.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>{t.location} · {t.service}</div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#FBBf24" color="#FBBf24" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32 }}>
            <button onClick={prev} className="btn btn-secondary btn-icon">
              <ChevronLeft size={20} />
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setCurr(i)}
                  style={{
                    width: i === curr ? 28 : 8, height: 8,
                    borderRadius: 4, border: 'none',
                    background: i === curr ? 'var(--primary)' : 'var(--border)',
                    transition: 'all 0.3s ease', cursor: 'pointer',
                  }}
                />
              ))}
            </div>
            <button onClick={next} className="btn btn-secondary btn-icon">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Mini testimonial avatars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 48, flexWrap: 'wrap' }}>
          {TESTIMONIALS.map((t, i) => (
            <button key={t.id} onClick={() => setCurr(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', borderRadius: 'var(--radius-full)',
                background: i === curr ? 'var(--primary-glow)' : 'var(--bg-card)',
                border: `1px solid ${i === curr ? 'var(--primary)' : 'var(--border)'}`,
                cursor: 'pointer', transition: 'var(--transition)',
              }}
            >
              <img src={t.avatar} alt={t.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: i === curr ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                {t.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
