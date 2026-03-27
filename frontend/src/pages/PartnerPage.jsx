import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight, Star, Users, Briefcase, TrendingUp, ArrowLeft } from 'lucide-react'
import axios from 'axios'

const CATEGORIES = [
  'Cleaning', 'Salon & Spa', 'Appliance Repair', 'Plumbing',
  'Electrician', 'Painting', 'Pest Control', 'Carpentry',
]

const CITIES = [
  'New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad',
  'Chennai', 'Pune', 'Kolkata', 'Ahmedabad',
]

const PERKS = [
  { icon: '💰', title: 'Earn More', desc: 'Get consistent work and earn up to ₹50,000/month working on your schedule.' },
  { icon: '📱', title: 'Easy Management', desc: 'Manage all your bookings, payments, and reviews from one simple dashboard.' },
  { icon: '🛡️', title: 'We Back You', desc: 'Insurance coverage, training, and 24/7 SmartServe support for every job.' },
  { icon: '⭐', title: 'Build Your Reputation', desc: 'Collect reviews and grow your profile to attract more premium customers.' },
]

export default function PartnerPage() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', city: 'New Delhi',
    service_category: 'Cleaning', experience_years: 1, about: '',
  })

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post('http://localhost:8000/api/partner/apply', {
        ...form,
        experience_years: parseInt(form.experience_years),
      })
      setSubmitted(true)
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ textAlign: 'center', maxWidth: 500 }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px', animation: 'fadeInUp 0.4s ease',
          }}>
            <CheckCircle size={44} color="var(--green)" />
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12 }}>Application Received! 🎉</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Thanks, <strong style={{ color: 'var(--primary-light)' }}>{form.full_name}</strong>!
            Your application is under review. We'll contact you at <strong>{form.email}</strong> within 2–3 business days.
          </p>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 32, textAlign: 'left',
          }}>
            {[
              { label: 'Service Category', value: form.service_category },
              { label: 'City', value: form.city },
              { label: 'Experience', value: `${form.experience_years} year${form.experience_years > 1 ? 's' : ''}` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                <span style={{ fontWeight: 700 }}>{row.value}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/')} style={{ width: '100%', justifyContent: 'center' }}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(16,185,129,0.1) 100%)',
        borderBottom: '1px solid var(--border)', padding: '64px 0 48px',
      }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <span className="badge badge-primary">🤝 Join SmartServe</span>
            <span className="badge badge-green">✅ 450+ Partners</span>
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.15 }}>
            Grow Your Business<br />
            <span style={{ background: 'linear-gradient(90deg, var(--primary-light), var(--green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              with SmartServe
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 18, maxWidth: 560, lineHeight: 1.7 }}>
            Join thousands of verified professionals earning more and serving customers who need exactly what you offer.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 36, flexWrap: 'wrap' }}>
            {[
              { icon: <Users size={18} />, stat: '50K+', label: 'Monthly Customers' },
              { icon: <Star size={18} />, stat: '4.8★', label: 'Avg Partner Rating' },
              { icon: <TrendingUp size={18} />, stat: '₹40K', label: 'Avg Monthly Earning' },
              { icon: <Briefcase size={18} />, stat: '8', label: 'Service Categories' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ color: 'var(--primary-light)' }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>{item.stat}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 960, paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48, alignItems: 'start' }}>

          {/* Left — Perks */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Why join SmartServe?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {PERKS.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 18, padding: 20,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)', animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 48, marginBottom: 24 }}>How it works</h2>
            {[
              { num: '01', title: 'Apply Below', desc: 'Fill out the quick form — takes less than 2 minutes.' },
              { num: '02', title: 'Get Verified', desc: 'Our team reviews your profile and verifies credentials.' },
              { num: '03', title: 'Start Earning', desc: 'Get matched with customers and manage all jobs in-app.' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--primary-glow)', border: '1px solid var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900, color: 'var(--primary-light)', flexShrink: 0,
                }}>{step.num}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Application Form */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-2xl)', padding: 32,
              boxShadow: '0 0 40px rgba(124,58,237,0.15)',
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Apply Now — It's Free</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
                Join 450+ professionals already on SmartServe
              </p>

              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-md)', padding: '12px 16px',
                  color: 'var(--red)', fontSize: 14, marginBottom: 20,
                }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>FULL NAME *</label>
                  <input className="input" required placeholder="Enter your full name"
                    value={form.full_name} onChange={e => update('full_name', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>EMAIL *</label>
                    <input className="input" type="email" required placeholder="you@email.com"
                      value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>PHONE *</label>
                    <input className="input" type="tel" required placeholder="9876543210"
                      value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>CITY *</label>
                    <select className="input" value={form.city} onChange={e => update('city', e.target.value)}>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>EXPERIENCE *</label>
                    <select className="input" value={form.experience_years} onChange={e => update('experience_years', e.target.value)}>
                      {[1,2,3,4,5,6,7,8,9,10].map(y => <option key={y} value={y}>{y}+ year{y > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>SERVICE CATEGORY *</label>
                  <select className="input" value={form.service_category} onChange={e => update('service_category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>ABOUT YOU (optional)</label>
                  <textarea className="input" rows={3} placeholder="Tell us about your skills and experience..."
                    value={form.about} onChange={e => update('about', e.target.value)}
                    style={{ resize: 'none' }} />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
                  {loading
                    ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Submitting...</>
                    : <>Submit Application <ChevronRight size={18} /></>
                  }
                </button>
                <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
                  🔒 Your information is secure and never shared with third parties
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .container > div[style*="grid-template-columns: 1fr 420px"] {
            grid-template-columns: 1fr !important;
          }
        }
        select.input { background: var(--bg-input); }
        select.input option { background: var(--bg-card); }
      `}</style>
    </div>
  )
}
