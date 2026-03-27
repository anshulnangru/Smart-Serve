import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, LogOut, ChevronRight, Edit2, Save, X, Shield, Bell, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })

  if (!user) {
    navigate('/login')
    return null
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return }
    setSaving(true)
    try {
      await updateUser(form.name, form.phone)
      toast.success('Profile updated successfully! ✅')
      setEditing(false)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({ name: user.name || '', phone: user.phone || '' })
    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const STATS = [
    { icon: '📋', label: 'My Bookings', value: 'View all', action: () => navigate('/my-bookings') },
    { icon: '⭐', label: 'Reviews Given', value: 'Coming soon', action: null },
    { icon: '💰', label: 'Total Saved', value: '₹0', action: null },
  ]

  const MENU_ITEMS = [
    { icon: <Bell size={18} />, label: 'Notifications', sub: 'Manage your alerts', action: () => toast.success('Notifications settings coming soon!') },
    { icon: <Shield size={18} />, label: 'Privacy & Security', sub: 'Manage account security', action: () => toast.success('Security settings coming soon!') },
    { icon: <Calendar size={18} />, label: 'My Bookings', sub: 'View all your bookings', action: () => navigate('/my-bookings') },
  ]

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      {/* Header banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0.05) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 0 28px',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 4 }}>My Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Manage your account details</p>
        </div>
      </div>

      <div className="container section-py-sm" style={{ maxWidth: 720 }}>
        {/* Profile card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)', padding: 32, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`}
                alt={user.name}
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--green)', border: '2px solid var(--bg-card)',
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{user.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user.email}</p>
              {user.phone && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user.phone}</p>}
            </div>
            {!editing ? (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                <Edit2 size={14} /> Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Save size={14} />} Save
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleCancel} disabled={saving}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>FULL NAME *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="input"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{ paddingLeft: 44 }}
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>PHONE NUMBER</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="input"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 90000 90000"
                    style={{ paddingLeft: 44 }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>EMAIL ADDRESS</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="input"
                    value={user.email}
                    disabled
                    style={{ paddingLeft: 44, opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>Email cannot be changed</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: <User size={16} />, label: 'Name', value: user.name },
                { icon: <Mail size={16} />, label: 'Email', value: user.email },
                { icon: <Phone size={16} />, label: 'Phone', value: user.phone || 'Not added' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--primary-light)', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {STATS.map(stat => (
            <button
              key={stat.label}
              onClick={stat.action || undefined}
              disabled={!stat.action}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', padding: '20px 16px',
                textAlign: 'center', cursor: stat.action ? 'pointer' : 'default',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => { if (stat.action) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600 }}>{stat.value}</div>
            </button>
          ))}
        </div>

        {/* Menu items */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', marginBottom: 24 }}>
          {MENU_ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                padding: '18px 24px', textAlign: 'left', transition: 'var(--transition)',
                borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid var(--border)' : 'none',
                color: 'var(--text)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: 'var(--primary-light)', width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn btn-lg"
          style={{
            width: '100%', justifyContent: 'center',
            background: 'rgba(239,68,68,0.1)', color: 'var(--red)',
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  )
}
