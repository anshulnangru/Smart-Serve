import { ClipboardList, UserCheck, Wrench, ThumbsUp } from 'lucide-react'

const STEPS = [
  {
    icon: <ClipboardList size={28} />,
    step: '01',
    title: 'Choose a Service',
    desc: 'Browse from 50+ services across 8 categories. Filter by type, price, and rating.',
    color: '#7C3AED',
  },
  {
    icon: <UserCheck size={28} />,
    step: '02',
    title: 'Pick Date & Time',
    desc: 'Select a convenient time slot. Our pros are available 7 days a week, from 9 AM to 6 PM.',
    color: '#F59E0B',
  },
  {
    icon: <Wrench size={28} />,
    step: '03',
    title: 'Pro Arrives',
    desc: 'Your verified professional arrives on time with all the tools needed to get the job done.',
    color: '#10B981',
  },
  {
    icon: <ThumbsUp size={28} />,
    step: '04',
    title: 'Enjoy & Rate',
    desc: 'Enjoy the service, make payment digitally, and leave a review to help the community.',
    color: '#3B82F6',
  },
]

export default function HowItWorks() {
  return (
    <section className="section-py" id="how-it-works" style={{
      background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(124,58,237,0.12) 0%, transparent 70%), var(--bg)',
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, marginBottom: 12 }}>
            How It Works
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Book a service in under 60 seconds. It really is that simple.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute', top: 44, left: '12%', right: '12%', height: 2,
            background: 'linear-gradient(90deg, transparent, var(--border), var(--border), transparent)',
            display: 'none',
          }} className="connector-line" />

          {STEPS.map((step, i) => (
            <div key={step.step}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', padding: 28,
                textAlign: 'center', transition: 'var(--transition)',
                animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = step.color
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = `0 12px 40px ${step.color}25`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Step number */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 56, height: 56, borderRadius: '50%',
                background: `${step.color}20`, border: `2px solid ${step.color}60`,
                color: step.color, marginBottom: 16, position: 'relative',
              }}>
                {step.icon}
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  width: 22, height: 22, borderRadius: '50%',
                  background: step.color, color: 'white',
                  fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .connector-line { display: block !important; }
        }
      `}</style>
    </section>
  )
}
