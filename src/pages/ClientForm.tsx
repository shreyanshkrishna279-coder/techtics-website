import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'

const API = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'

const SERVICE_OPTIONS = [
  'Website Development',
  'Mobile Application',
  'AI Automation',
  'AI Agents',
  'WhatsApp Automation',
]

export default function ClientForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    contact: '',
    businessName: '',
    businessDetails: '',
    services: [] as string[],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const toggleService = (s: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.contact || !form.businessName) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/client-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error('Server error')
      navigate('/client/agreement', { state: { form } })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ background: '#090909', minHeight: '100vh', color: '#F0F0F0' }}>
      {/* Nav */}
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
        <Link to="/" style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#5A5A5A', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5A5A5A')}
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Form */}
      <div style={{ padding: '120px 40px 80px', maxWidth: 640, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#C6FF00', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            Grow Your Business
          </div>
          <h1 style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 48px' }}>
            Tell Us About
            <br />
            <span style={{ color: '#C6FF00' }}>Your Business</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { label: 'Your Name *', key: 'name', type: 'text', placeholder: 'e.g. John Doe' },
                { label: 'Mobile Number or Email *', key: 'contact', type: 'text', placeholder: 'e.g. +92 300 1234567' },
                { label: 'Business Name *', key: 'businessName', type: 'text', placeholder: 'e.g. My Store' },
                { label: 'Business Details', key: 'businessDetails', type: 'textarea', placeholder: 'Tell us about your business, your goals, and what you need help with...' },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#5A5A5A', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={4}
                      style={{
                        width: '100%', background: '#111', border: '1px solid #1E1E1E', padding: '14px 16px',
                        color: '#F0F0F0', fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none',
                        transition: 'border-color 0.2s', resize: 'vertical',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#C6FF00')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#1E1E1E')}
                    />
                  ) : (
                    <input
                      type="text"
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%', background: '#111', border: '1px solid #1E1E1E', padding: '14px 16px',
                        color: '#F0F0F0', fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#C6FF00')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#1E1E1E')}
                    />
                  )}
                </div>
              ))}

              {/* Services */}
              <div>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#5A5A5A', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
                  Which services do you need?
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SERVICE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        padding: '8px 16px', border: `1px solid ${form.services.includes(s) ? '#C6FF00' : '#222'}`,
                        background: form.services.includes(s) ? 'rgba(198,255,0,0.08)' : 'transparent',
                        color: form.services.includes(s) ? '#C6FF00' : '#4A4A4A',
                        letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <p style={{ color: '#FF6B6B', fontFamily: "'Inter', sans-serif", fontSize: 14, marginTop: 16 }}>{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
                color: '#090909', background: '#C6FF00', border: 'none',
                padding: '16px 40px', marginTop: 40, cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1, transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.opacity = '1' }}
            >
              {submitting ? 'Submitting...' : 'Submit →'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
