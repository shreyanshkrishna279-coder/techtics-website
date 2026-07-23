import { useState, useEffect } from 'react'

const STORAGE_KEY = 'techtics_cookie_consent'

type Consent = 'accepted' | 'declined' | null

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== 'accepted' && stored !== 'declined') {
      setConsent(null)
    } else {
      setConsent(stored as Consent)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setConsent('accepted')
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setConsent('declined')
  }

  if (consent !== null) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 99990,
      background: '#111',
      borderTop: '1px solid #1A1A1A',
      padding: '20px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
    }}>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#666',
        lineHeight: 1.6, margin: 0, maxWidth: 600,
      }}>
        This website uses cookies to improve your experience. By continuing, you agree to our{' '}
        <a href="/privacy" style={{ color: '#C6FF00', textDecoration: 'none' }}>Privacy Policy</a>.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={decline}
          style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
            color: '#5A5A5A', background: 'transparent', border: '1px solid #222',
            padding: '8px 20px', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3A3A3A'; e.currentTarget.style.color = '#F0F0F0' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#5A5A5A' }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
            color: '#090909', background: '#C6FF00', border: 'none',
            padding: '8px 20px', cursor: 'pointer', transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Accept All
        </button>
      </div>
    </div>
  )
}
