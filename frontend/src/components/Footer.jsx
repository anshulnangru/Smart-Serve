import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const FOOTER_LINKS = {
  'Services': ['Home Cleaning', 'Salon & Spa', 'Appliance Repair', 'Plumbing', 'Electrician', 'Painting'],
  'Company': ['About Us', 'Careers', 'Blog', 'Press', 'Partner with Us'],
  'Support': ['Help Center', 'Safety', 'Cancellation Policy', 'Terms of Service', 'Privacy Policy'],
}

const SOCIALS = [
  { icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
  { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
  { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
  { icon: <Youtube size={18} />, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)', paddingTop: 64, paddingBottom: 32 }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: 'white',
              }}>S</div>
              <span style={{ fontSize: 20, fontWeight: 800 }}>
                Smart<span style={{ color: 'var(--primary-light)' }}>Serve</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
              India's most trusted home services platform. Expert professionals, transparent pricing, happiness guaranteed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: <Phone size={14} />, text: '+91 90000 90000' },
                { icon: <Mail size={14} />, text: 'support@smartserve.in' },
                { icon: <MapPin size={14} />, text: 'New Delhi, India' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                  <span style={{ color: 'var(--primary-light)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 20, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(link => (
                  <li key={link}>
                    <Link to="#" style={{ color: 'var(--text-muted)', fontSize: 13, transition: 'var(--transition)' }}
                      onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                    >{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            © {new Date().getFullYear()} SmartServe Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label}
                style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', transition: 'var(--transition)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--primary-glow)'
                  e.currentTarget.style.color = 'var(--primary-light)'
                  e.currentTarget.style.borderColor = 'var(--primary)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg-input)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >{s.icon}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
          .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48; margin-bottom: 56px; }
          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .footer-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
    </footer>
  )
}
