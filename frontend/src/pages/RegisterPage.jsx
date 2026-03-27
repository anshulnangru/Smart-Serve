import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = location.state?.redirect || '/'

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all required fields'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      toast.success('Account created! Welcome to SmartServe 🎉')
      navigate(redirect)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  const fields = [
    { key: 'name', label: 'FULL NAME', placeholder: 'Your name', icon: <User size={16} />, type: 'text', required: true },
    { key: 'email', label: 'EMAIL ADDRESS', placeholder: 'you@example.com', icon: <Mail size={16} />, type: 'email', required: true },
    { key: 'phone', label: 'PHONE NUMBER (optional)', placeholder: '+91 90000 90000', icon: <Phone size={16} />, type: 'tel', required: false },
  ]

  return (
    <div className="page-enter" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 60%), var(--bg)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 900, color: 'white',
            boxShadow: '0 8px 30px var(--primary-glow)',
          }}>S</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create an account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Join 10M+ happy customers</p>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)', padding: '36px 32px',
          boxShadow: 'var(--shadow-glow)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{f.icon}</span>
                  <input type={f.type} className="input" placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                    style={{ paddingLeft: 44 }} required={f.required} />
                </div>
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>PASSWORD *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPw ? 'text' : 'password'} className="input" placeholder="At least 6 characters"
                  value={form.password} onChange={e => update('password', e.target.value)} style={{ paddingLeft: 44, paddingRight: 44 }} required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Creating account...</> : <><UserPlus size={18} /> Create Account</>}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>
              By signing up you agree to our <a href="#" style={{ color: 'var(--primary-light)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--primary-light)' }}>Privacy Policy</a>
            </p>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Already have an account?{' '}
              <Link to="/login" state={{ redirect }} style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
