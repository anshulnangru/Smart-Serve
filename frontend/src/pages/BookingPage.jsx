import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Clock, MapPin, Calendar, ChevronRight, ArrowLeft, Check } from 'lucide-react'
import { fetchService, fetchTimeSlots, fetchCities, createBooking } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const STEP_LABELS = ['Schedule', 'Address', 'Confirm']

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [service, setService] = useState(null)
  const [timeSlots, setTimeSlots] = useState([])
  const [cities, setCities] = useState([])
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    date: '', timeSlot: '', address: '', city: 'New Delhi', pincode: '', notes: '',
  })

  useEffect(() => {
    if (!user) { navigate('/login', { state: { redirect: `/book/${id}` } }); return }
    window.scrollTo(0, 0)
    Promise.all([fetchService(id), fetchTimeSlots(), fetchCities()])
      .then(([sRes, tsRes, citiesRes]) => {
        setService(sRes.data)
        setTimeSlots(Array.isArray(tsRes.data) ? tsRes.data : (tsRes.data.time_slots || []))
        setCities(Array.isArray(citiesRes.data) ? citiesRes.data : (citiesRes.data.cities || []))
      })
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false))
  }, [id])

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  // Get min date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const pincodeValid = /^\d{6}$/.test(form.pincode)

  const canNext = [
    form.date && form.timeSlot,
    form.address && form.city && pincodeValid,
    true,
  ][step]

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await createBooking({
        service_id: service.id,
        booking_date: form.date,
        time_slot: form.timeSlot,
        address: `${form.address}, ${form.city}`,
        pincode: form.pincode,
        notes: form.notes,
        total_price: service.price,
      })
      toast.success('Booking confirmed! 🎉')
      navigate('/my-bookings')
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Format date without timezone offset issue
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  )

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      <div className="container" style={{ paddingTop: 32 }}>
        <button onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
          <ArrowLeft size={16} /> {step === 0 ? 'Back' : STEP_LABELS[step - 1]}
        </button>

        {/* Progress stepper */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40, maxWidth: 500 }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEP_LABELS.length - 1 ? 1 : 'unset' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: i < step ? 'var(--green)' : i === step ? 'var(--primary)' : 'var(--bg-card)',
                  border: `2px solid ${i < step ? 'var(--green)' : i === step ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, transition: 'var(--transition)',
                  color: i <= step ? 'white' : 'var(--text-muted)',
                }}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: i === step ? 'var(--primary-light)' : 'var(--text-muted)' }}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'var(--green)' : 'var(--border)', margin: '0 8px', marginBottom: 24, transition: 'var(--transition)' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', padding: 32 }}>
            {/* Step 0 - Schedule */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={22} color="var(--primary-light)" /> Choose Date &amp; Time
                </h2>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                    SELECT DATE *
                  </label>
                  <input type="date" className="input" value={form.date} min={minDate}
                    onChange={e => update('date', e.target.value)}
                    style={{ fontSize: 15, colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
                    SELECT TIME SLOT *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                    {timeSlots.map(slot => (
                      <button key={slot} onClick={() => update('timeSlot', slot)}
                        style={{
                          padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                          background: form.timeSlot === slot ? 'var(--primary-glow)' : 'var(--bg-input)',
                          border: `1px solid ${form.timeSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                          color: form.timeSlot === slot ? 'var(--primary-light)' : 'var(--text)',
                          transition: 'var(--transition)',
                        }}
                      >
                        {form.timeSlot === slot && <Check size={12} style={{ display: 'inline', marginRight: 6 }} />}
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 - Address */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin size={22} color="var(--primary-light)" /> Service Address
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>FULL ADDRESS *</label>
                    <textarea className="input" rows={3} placeholder="Flat/House no., Building, Street, Area..."
                      value={form.address} onChange={e => update('address', e.target.value)}
                      style={{ resize: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>CITY *</label>
                      <select className="input" value={form.city} onChange={e => update('city', e.target.value)}>
                        {(cities.length > 0 ? cities : ['New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad']).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>PINCODE *</label>
                      <input className="input" type="text" placeholder="110001" maxLength={6}
                        value={form.pincode}
                        onChange={e => update('pincode', e.target.value.replace(/\D/g, ''))} />
                      {form.pincode && !pincodeValid && (
                        <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 6 }}>Pincode must be exactly 6 digits</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>SPECIAL INSTRUCTIONS (optional)</label>
                    <textarea className="input" rows={2} placeholder="Any special notes for the professional..."
                      value={form.notes} onChange={e => update('notes', e.target.value)} style={{ resize: 'none' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Confirm */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Confirm Booking</h2>
                {[
                  { icon: '🛠️', label: 'Service', value: service.name },
                  { icon: '📅', label: 'Date', value: formatDate(form.date) },
                  { icon: '⏰', label: 'Time', value: form.timeSlot },
                  { icon: '📍', label: 'Address', value: `${form.address}, ${form.city} - ${form.pincode}` },
                  { icon: '💰', label: 'Total', value: `₹${service.price} (Pay after service)` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
                {form.notes && (
                  <div style={{ display: 'flex', gap: 14, padding: '14px 0' }}>
                    <span style={{ fontSize: 20 }}>📝</span>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Notes</div>
                      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{form.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              {step < 2 ? (
                <button className="btn btn-primary btn-lg" disabled={!canNext}
                  onClick={() => setStep(s => s + 1)}
                  style={{ opacity: canNext ? 1 : 0.5, cursor: canNext ? 'pointer' : 'not-allowed' }}
                >
                  Continue <ChevronRight size={18} />
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Confirming...</> : '✅ Confirm Booking'}
                </button>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-2xl)', padding: 24, position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
            <img src={service.image} alt={service.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 14 }} />
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{service.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} /> {service.duration}
            </div>
            <hr className="divider" style={{ marginBottom: 16 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: 'var(--text-muted)' }}>
              <span>Service charge</span>
              <span>₹{service.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: 'var(--text-muted)' }}>
              <span>Platform fee</span>
              <span style={{ color: 'var(--green)' }}>FREE</span>
            </div>
            <hr className="divider" style={{ marginBottom: 12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800 }}>
              <span>Total</span>
              <span>₹{service.price}</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Pay after service completion</p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: 1fr 340px"] { grid-template-columns: 1fr !important; }
        }
        select.input { background: var(--bg-input); }
        select.input option { background: var(--bg-card); }
      `}</style>
    </div>
  )
}
