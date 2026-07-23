import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Cursor from '../components/Cursor'

export default function PrivacyPolicy() {
  return (
    <div style={{ background: '#090909', minHeight: '100vh', color: '#F0F0F0' }}>
      <Cursor />
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

      <div className="agreement-page" style={{ padding: '120px 40px 80px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#C6FF00', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 48px' }}>
            Privacy
            <br />
            <span style={{ color: '#C6FF00' }}>Policy</span>
          </h1>

          <div className="agreement-box" style={{ border: '1px solid #1A1A1A', padding: 40, marginBottom: 40 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 32, fontStyle: 'italic' }}>
              Last updated: July 2026
            </p>

            <Section title="1. Information We Collect">
              <p>We collect information you provide directly when you fill out our registration forms, including your name, contact details, business name, and service preferences. When you visit our website, we automatically collect certain technical data such as your IP address, browser type, device information, and pages visited.</p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>Your information is used to process your registration, deliver the services you request, communicate with you about your projects, improve our website and services, and send administrative emails. We may also use aggregated, anonymized data for analytics and business insights.</p>
            </Section>

            <Section title="3. Data Sharing and Disclosure">
              <p>We do not sell your personal information to third parties. We may share your data with trusted team members and developers who need it to fulfill your project. We may also disclose information if required by law or to protect our legal rights.</p>
            </Section>

            <Section title="4. Data Retention">
              <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Agreement records are kept for a minimum of 3 years after project completion. You may request deletion of your data by contacting us.</p>
            </Section>

            <Section title="5. Your Rights">
              <p>You have the right to access, correct, or delete your personal data held by us. You may withdraw consent for communications at any time. To exercise these rights, email us at techtics55@gmail.com.</p>
            </Section>

            <Section title="6. Cookies">
              <p>Our website uses essential cookies for basic functionality and analytics cookies to understand how visitors interact with the site. You can control cookie preferences through your browser settings. See our Cookie Settings for more details.</p>
            </Section>

            <Section title="7. Security">
              <p>We implement industry-standard security measures including SSL encryption, secure data storage, and restricted access to personal information. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
            </Section>

            <Section title="8. Third-Party Services">
              <p>We use Supabase for database storage, Netlify for hosting, and Gmail for email communications. These services have their own privacy policies governing data processing. We ensure all third-party providers comply with applicable data protection regulations.</p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of our website after changes constitutes acceptance of the updated policy.</p>
            </Section>

            <Section title="10. Contact Us">
              <p>For questions about this Privacy Policy or to exercise your data rights, contact us at <a href="mailto:techtics55@gmail.com" style={{ color: '#C6FF00', textDecoration: 'none' }}>techtics55@gmail.com</a>.</p>
            </Section>
          </div>

          <Link to="/" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
            color: '#090909', background: '#C6FF00', padding: '14px 32px',
            textDecoration: 'none', display: 'inline-block', transition: 'opacity 0.2s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{
        fontFamily: "'Urbanist', sans-serif", fontSize: 18, fontWeight: 700,
        color: '#F0F0F0', margin: '0 0 12px', letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#666',
        lineHeight: 1.8, margin: 0,
      }}>
        {children}
      </div>
    </div>
  )
}
