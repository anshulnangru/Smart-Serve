import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Calendar, ChevronRight, X, Star } from 'lucide-react'
import { fetchBookings, cancelBooking } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const STATUS_STYLES = {
  confirmed: { bg: 'rgba(16,185,129,0.12)', color: 'var(--green)', border: 'rgba(16,185,129,0.3)', label: '✅ Confirmed' },
  pending: { bg: 'rgba(245,158,11,0.12)', color: 'var(--accent-light)', border: 'rgba(245,158,11,0.3)', label: '⏳ Pending' },
  completed: { bg: 'rgba(139,92,246,0.12)', color: 'var(--primary-light)', border: 'rgba(139,92,246,0.3)', label: '🎉 Completed' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: 'rgba(239,68,68,0.2)', label: '❌ Cancelled' },
}

function BookingCard({ booking, onCancel }) {
  const navigate = useNavigate()
  const sl = STATUS_STYLES[booking.booking_status] || STATUS_STYLES.pending
  const [cancelling, setCancelling] = useState(false)
  const toast = useToast()

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancelling(true)
    try {
      await onCancel(booking.id)
      toast.success('Booking cancelled successfully')
    } catch {
      toast.error('Failed to cancel booking')
    } finally { setCancelling(false) }
  }

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'var(--transition)',
    }}>
      <div style={{ display: 'flex', gap: 0 }}>
        <img src={booking.service_image} alt={booking.service_name}
          style={{ width: 120, height: 120, objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ padding: '16px 20px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{booking.service_name}</h3>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: sl.bg, color: sl.color, border: `1px solid ${sl.border}`, whiteSpace: 'nowrap', marginLeft: 8,
            }}>{sl.label}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={13} />
              {new Date(booking.booking_date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={13} /> {booking.time_slot}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {booking.address} {booking.pincode ? `- ${booking.pincode}` : ''}</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 18, fontWeight: 800 }}>₹{booking.total_price}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>Pay after service</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate(`/services/${booking.service_id}`)} className="btn btn-secondary btn-sm">
            View Service
          </button>
          {booking.booking_status === 'confirmed' && (
            <button onClick={handleCancel} disabled={cancelling} className="btn btn-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)' }}>
              {cancelling ? '...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchBookings()
      .then(r => setBookings(Array.isArray(r.data) ? r.data : (r.data.bookings || [])))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleCancel = async (id) => {
    await cancelBooking(id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>My Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            {bookings.length > 0 ? `${bookings.length} booking${bookings.length > 1 ? 's' : ''}` : 'Track and manage your service bookings'}
          </p>
        </div>
      </div>

      <div className="container section-py-sm">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📋</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No bookings yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 15 }}>
              Book your first home service and enjoy a seamless experience!
            </p>
            <button onClick={() => navigate('/services')} className="btn btn-primary btn-lg">
              Browse Services <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
            {bookings.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
          </div>
        )}
      </div>
    </div>
  )
}
