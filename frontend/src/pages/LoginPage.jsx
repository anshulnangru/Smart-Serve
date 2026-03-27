import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = location.state?.redirect || '/'

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! 👋')
      navigate(redirect)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-enter" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 60%), var(--bg)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 900, color: 'white',
            boxShadow: '0 8px 30px var(--primary-glow)',
          }}>S</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Welcome back!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Login to your SmartServe account</p>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)', padding: '36px 32px',
          boxShadow: 'var(--shadow-glow)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>EMAIL ADDRESS</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" className="input" placeholder="you@example.com" value={form.email}
                  onChange={e => update('email', e.target.value)} style={{ paddingLeft: 44 }} required />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPw ? 'text' : 'password'} className="input" placeholder="Enter your password"
                  value={form.password} onChange={e => update('password', e.target.value)} style={{ paddingLeft: 44, paddingRight: 44 }} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Logging in...</> : <><LogIn size={18} /> Login</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link to="/register" state={{ redirect }} style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Sign up free</Link>
            </p>
          </div>

          {/* Demo hint */}
          <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
            💡 Create an account to test — no email verification needed
          </div>
        </div>
      </div>
    </div>
  )
}
