import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link, useNavigate } from 'react-router-dom'

const API = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'

const AGREEMENT_POINTS = [
  'The business must provide all details and information needed for the project and may not refuse to supply information required by the team.',
  'A client may not abandon a project after requesting it and once work has begun; the client must proceed with the project whether they wish to or not, once the developer has started.',
  'If the client refuses to provide business information needed for the project and the result is unsatisfactory, the client assumes responsibility; we are not liable for deficiencies caused by the lack of details.',
  'Clients must pay at least 10% of the total amount in advance for the project.',
  'The client must pay the full remaining balance within one week after delivery of the product. Failure to do so will result in action by the company.',
  'Once our services are sold, they are non-refundable. The client must have to retain them, but no refund will be issued.',
  'Clients may not direct personal questions to the finance or development teams.',
  'Clients may not contact or establish connections with the developers, as this is prohibited by company policy.',
  'If a client has any problem with the project, they must notify us within one week; after that, we are not responsible for resolving the issue.',
]

export default function ClientAgreement() {
  const location = useLocation()
  const navigate = useNavigate()
  const form = (location.state as any)?.form
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!form) {
    return (
      <div style={{ background: '#090909', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, color: '#F0F0F0' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#666' }}>No registration data found.</p>
        <Link to="/client/register" style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#C6FF00', textDecoration: 'none' }}>← Start again</Link>
      </div>
    )
  }

  const handleAgree = async () => {
    if (!agreed) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${API}/client-agreement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error('Server error')
      setDone(true)
    } catch {
      setError('Failed to save agreement. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div style={{ background: '#090909', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0F0F0' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 500, padding: '0 40px' }}>
          <div style={{ width: 48, height: 48, background: '#C6FF00', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 32, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Agreement Signed
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#666', lineHeight: 1.7, margin: '0 0 32px' }}>
            Thank you, {form.name}! Your agreement has been received. Our team will review your details and get back to you within 24 hours.
          </p>
          <Link to="/" style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: '#090909', background: '#C6FF00', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>
            Back to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ background: '#090909', minHeight: '100vh', color: '#F0F0F0' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 40px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1A1A1A',
        background: 'rgba(9,9,9,0.92)', backdropFilter: 'blur(20px)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#C6FF00', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', flexShrink: 0 }} />
          <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 800, fontSize: 18, color: '#F0F0F0', letterSpacing: '-0.02em' }}>TechTics</span>
        </Link>
      </nav>

      <div style={{ padding: '120px 40px 80px', maxWidth: 720, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#C6FF00', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            Step 2 of 2
          </div>
          <h1 style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Client
            <br />
            <span style={{ color: '#C6FF00' }}>Agreement</span>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 40 }}>
            Please read the following terms carefully. By agreeing, you enter into a formal engagement with TechTics.
          </p>

          <div style={{ border: '1px solid #1A1A1A', padding: 32, marginBottom: 40 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
              This Agreement sets forth the terms and conditions between TechTics ("the Company") and the client ("you"). By accepting this agreement, you acknowledge and agree to the following:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {AGREEMENT_POINTS.map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#C6FF00', flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#888', lineHeight: 1.7, margin: 0 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 24 }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#C6FF00', cursor: 'pointer' }}
            />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: agreed ? '#F0F0F0' : '#666', transition: 'color 0.2s' }}>
              I have read and agree to all the terms and conditions above
            </span>
          </label>

          {error && <p style={{ color: '#FF6B6B', fontFamily: "'Inter', sans-serif", fontSize: 14, marginBottom: 16 }}>{error}</p>}

          <button
            onClick={handleAgree}
            disabled={!agreed || submitting}
            style={{
              fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
              color: '#090909', background: '#C6FF00', border: 'none',
              padding: '16px 40px', cursor: (!agreed || submitting) ? 'not-allowed' : 'pointer',
              opacity: (!agreed || submitting) ? 0.4 : 1, transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => { if (agreed && !submitting) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={(e) => { if (agreed && !submitting) e.currentTarget.style.opacity = '1' }}
          >
            {submitting ? 'Processing...' : 'I Agree & Sign →'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
