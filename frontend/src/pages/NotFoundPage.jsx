import { useNavigate } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--primary-light)', marginBottom: 12 }}>404</h1>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Page not found</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, maxWidth: 360 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Home size={18} /> Go Home
        </button>
      </div>
    </div>
  )
}
