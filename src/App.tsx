import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, animate } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ClientForm from './pages/ClientForm'
import DeveloperForm from './pages/DeveloperForm'
import ClientAgreement from './pages/ClientAgreement'
import DeveloperAgreement from './pages/DeveloperAgreement'

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    num: '01',
    title: 'Web Development',
    short: 'Your 24/7 sales machine. Ready in weeks.',
    desc: 'High-performance websites built to convert. Fast, responsive, and engineered so your business stays open and earning — even while you sleep.',
    tags: ['Landing Pages', 'Web Apps', 'CMS', 'SEO-Optimized'],
  },
  {
    num: '02',
    title: 'Mobile Applications',
    short: 'Your brand in every pocket.',
    desc: 'Native iOS & Android apps your customers will love. Intuitive design, flawless performance, and built to keep users coming back day after day.',
    tags: ['iOS', 'Android', 'Cross-Platform', 'UX-First'],
  },
  {
    num: '03',
    title: 'AI Automations',
    short: 'Workflows that run on autopilot.',
    desc: 'From lead capture to follow-ups, reporting to onboarding — we build intelligent pipelines that work 24/7 so your team can focus on what matters.',
    tags: ['Workflow Automation', 'Lead Gen', 'CRM Integration', 'Reporting'],
  },
  {
    num: '04',
    title: 'WhatsApp Commerce',
    short: 'Meet customers where they live.',
    desc: 'WhatsApp bots that take orders, answer questions, book appointments, and follow up — all inside the world\'s most popular messaging app. Instant, personal, powerful.',
    tags: ['Order Management', 'Appointment Booking', 'Broadcast Campaigns'],
  },
  {
    num: '05',
    title: 'AI Agents',
    short: 'Your smartest team member. Never sleeps.',
    desc: 'Custom AI agents trained on your business — they handle customers, qualify leads, resolve queries, and escalate smartly. Like hiring a team of geniuses overnight.',
    tags: ['Custom Training', 'Multilingual', 'CRM-Connected', 'Always On'],
  },
  {
    num: '06',
    title: 'E-commerce Solutions',
    short: 'From storefront to global brand.',
    desc: 'Full-stack online stores with catalog, checkout, inventory, and analytics. We build the infrastructure that turns local shops into digital empires.',
    tags: ['Product Catalog', 'Payment Gateway', 'Analytics', 'Order Management'],
  },
]

const REVIEWS = [
  {
    id: 1,
    name: 'Aryan Mehta',
    co: 'Mehta\'s Kitchen',
    role: 'Restaurant Owner',
    text: 'Our online orders tripled in six weeks. TechTics built something that actually works. Customers call it the best restaurant experience in the city.',
    tx: -520, ty: -260, fr: -18, rotation: -4,
  },
  {
    id: 2,
    name: 'Sara Qureshi',
    co: 'Bloom Health Clinic',
    role: 'Clinic Director',
    text: 'We went from 40 manual calls a day to zero. Appointment booking, reminders, follow-ups — all automated. It feels like we hired five people overnight.',
    tx: 490, ty: -300, fr: 20, rotation: 3,
  },
  {
    id: 3,
    name: 'Rahul Joshi',
    co: 'Joshi General Store',
    role: 'Owner',
    text: 'The WhatsApp bot processes 200+ orders daily while I focus on the shop floor. Revenue is up 140%. I only wish I had found TechTics sooner.',
    tx: -580, ty: 180, fr: -25, rotation: -2,
  },
  {
    id: 4,
    name: 'Nadia Farooq',
    co: 'Grand Palace Hotel',
    role: 'General Manager',
    text: 'Direct bookings jumped 85% in the first quarter. The AI concierge handles guest queries round the clock. Every detail was executed to the highest standard.',
    tx: 540, ty: 230, fr: 22, rotation: 5,
  },
  {
    id: 5,
    name: 'Vikram Singh',
    co: 'Singh Wholesale Hub',
    role: 'Managing Director',
    text: 'Our B2B portal cut order processing time by 70%. Clients order at 2 a.m. and we wake up to a clean dashboard. TechTics changed how we operate.',
    tx: -290, ty: 370, fr: -20, rotation: -3,
  },
  {
    id: 6,
    name: 'Ayesha Malik',
    co: 'Malik Fashion Boutique',
    role: 'Founder',
    text: 'Customers outside my city now account for 60% of revenue. The online store is stunning — people reach out just to compliment how it looks and feels.',
    tx: 360, ty: 350, fr: 18, rotation: 2,
  },
  {
    id: 7,
    name: 'Rohan Patel',
    co: 'Patel AgriTech',
    role: 'Co-founder',
    text: 'The AI agent handles investor queries, books demos, and follows up automatically. We closed our seed round 40% faster than expected. Remarkable work.',
    tx: -460, ty: -60, fr: -28, rotation: -5,
  },
  {
    id: 8,
    name: 'Zara Ahmed',
    co: 'Spice Garden',
    role: 'Restaurant Owner',
    text: 'QR menus, table reservations, loyalty points. TechTics turned our small restaurant into a real digital brand. Our regulars notice every detail.',
    tx: 500, ty: -80, fr: 16, rotation: 1,
  },
]

const INDUSTRIES = [
  'Small Shops', 'Clinics', 'Restaurants', 'Hotels',
  'Wholesalers', 'Vendors', 'Startups', 'Service Firms',
  'Pharmacies', 'Real Estate', 'Education', 'Logistics',
]

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────────────────────

function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.12)
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.12)
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dot}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 8, height: 8,
          background: '#C6FF00',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />
      <div
        ref={ring}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 36, height: 36,
          border: '1px solid rgba(198,255,0,0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
        }}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL HOOK
// ─────────────────────────────────────────────────────────────────────────────

function useReveal(margin = '-60px') {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { rootMargin: margin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [margin])
  return { ref, visible }
}

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const ctrl = animate(0, target, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    })
    return () => ctrl.stop()
  }, [active, target])
  return count
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: '0 40px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: scrolled ? '1px solid #1A1A1A' : '1px solid transparent',
        background: scrolled ? 'rgba(9,9,9,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Logo */}
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img
          src="/logo.jpeg"
          alt="TechTics"
          style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
        />
        <span style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800,
          fontSize: 18,
          color: '#F0F0F0',
          letterSpacing: '-0.02em',
        }}>
          TechTics
        </span>
      </a>

      {/* Center links */}
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        {[['Services', '#services'], ['Process', '#process'], ['Reviews', '#reviews'], ['Contact', '#contact']].map(([label, href]) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: '#5A5A5A',
              textDecoration: 'none',
              transition: 'color 0.2s',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F0')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#5A5A5A')}
          >
            {label}
          </a>
        ))}
        <Link
          to="/client/register"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: '#5A5A5A',
            textDecoration: 'none',
            transition: 'color 0.2s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5A5A5A')}
        >
          For Clients
        </Link>
        <Link
          to="/developer/register"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: '#5A5A5A',
            textDecoration: 'none',
            transition: 'color 0.2s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5A5A5A')}
        >
          For Developers
        </Link>
      </div>

      {/* CTA */}
      <Link
        to="/client/register"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: '#090909',
          background: '#C6FF00',
          padding: '10px 22px',
          textDecoration: 'none',
          letterSpacing: '0.01em',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#090909' }}
      >
        Get Started
      </Link>
    </motion.nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 700,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 40px 80px',
        background: '#090909',
      }}
    >
      {/* Background video */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="ken-burns"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.3,
            transformOrigin: 'center',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(9,9,9,0.3) 0%, rgba(9,9,9,0.6) 50%, rgba(9,9,9,0.97) 100%)',
        }} />
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, width: '100%' }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#C6FF00',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          ——  Growth Partner
        </motion.div>

        {/* Headline */}
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: 'clamp(3.5rem, 8.5vw, 8.5rem)',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: '#F0F0F0',
              margin: 0,
            }}
          >
            Your Business.
            <br />
            <span style={{ color: '#C6FF00' }}>Digitally</span>
            <br />
            Unstoppable.
          </motion.h1>
        </div>

        {/* Tagline — Build, Automate, Scale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          style={{
            marginTop: 32,
            fontFamily: "'Urbanist', sans-serif",
            fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
            fontWeight: 700,
            color: '#C6FF00',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Build. Automate. Scale.
        </motion.div>

        {/* Bottom row */}
        <div style={{
          marginTop: 32,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 40,
          flexWrap: 'wrap',
        }}>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: '#666',
              lineHeight: 1.7,
              maxWidth: 420,
              margin: 0,
            }}
          >
            We build websites, apps, AI agents, and smart automations that
            transform local businesses into digital powerhouses. 100+ brands
            trust us to deliver results that actually move the needle.
          </motion.p>

          {/* Stats + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: 48 }}
          >
            <div style={{ borderLeft: '1px solid #2A2A2A', paddingLeft: 24 }}>
              <div style={{
                fontFamily: "'Urbanist', sans-serif",
                fontSize: 42,
                fontWeight: 900,
                color: '#F0F0F0',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}>
                100<span style={{ color: '#C6FF00' }}>+</span>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: '#5A5A5A',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginTop: 6,
              }}>
                Happy Businesses
              </div>
            </div>

            <a
              href="#services"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#F0F0F0',
                border: '1px solid #2A2A2A',
                padding: '14px 28px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'border-color 0.3s, color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C6FF00'
                e.currentTarget.style.color = '#C6FF00'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A2A'
                e.currentTarget.style.color = '#F0F0F0'
              }}
            >
              Explore Services
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: 'absolute', bottom: 80, right: 40,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}
      >
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: '#3A3A3A',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          writingMode: 'vertical-rl',
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, #3A3A3A, transparent)' }}
        />
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE INDUSTRIES
// ─────────────────────────────────────────────────────────────────────────────

function IndustryStrip() {
  const doubled = [...INDUSTRIES, ...INDUSTRIES]
  return (
    <div style={{
      borderTop: '1px solid #1A1A1A',
      borderBottom: '1px solid #1A1A1A',
      padding: '16px 0',
      overflow: 'hidden',
      background: '#090909',
    }}>
      <div className="marquee-track" style={{ display: 'flex', gap: 0, width: 'max-content' }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#3A3A3A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0 32px',
            }}>
              {item}
            </span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#C6FF00', opacity: 0.5, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES — ACCORDION LIST
// ─────────────────────────────────────────────────────────────────────────────

function ServiceRow({ svc, index, delay }: { svc: typeof SERVICES[0]; index: number; delay: number }) {
  const [open, setOpen] = useState(false)
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' visible' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="service-row"
        style={{
          borderBottom: '1px solid #1A1A1A',
          padding: '28px 0',
          display: 'grid',
          gridTemplateColumns: '80px 1fr auto',
          alignItems: 'start',
          gap: 32,
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(198,255,0,0.01)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Number */}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: open ? '#C6FF00' : '#3A3A3A',
          letterSpacing: '0.08em',
          paddingTop: 6,
          transition: 'color 0.3s',
        }}>
          {svc.num}
        </span>

        {/* Content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 700,
              color: '#F0F0F0',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              {svc.title}
            </h3>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              color: '#4A4A4A',
              fontStyle: 'italic',
            }}>
              {svc.short}
            </span>
          </div>

          {/* Expanded */}
          <motion.div
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              color: '#666',
              lineHeight: 1.75,
              marginTop: 16,
              maxWidth: 640,
            }}>
              {svc.desc}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {svc.tags.map((tag) => (
                <span key={tag} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: '#4A4A4A',
                  border: '1px solid #222',
                  padding: '5px 12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: 'none',
            border: '1px solid #222',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#5A5A5A',
            transition: 'all 0.3s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#C6FF00'
            e.currentTarget.style.color = '#C6FF00'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#222'
            e.currentTarget.style.color = '#5A5A5A'
          }}
          aria-label="toggle"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <motion.line
              x1="7" y1="1" x2="7" y2="13"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              animate={{ opacity: open ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function Services() {
  const { ref, visible } = useReveal()

  return (
    <section id="services" style={{ padding: '120px 40px', background: '#090909' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'end', marginBottom: 80 }}>
          <div className={`reveal${visible ? ' visible' : ''}`}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#C6FF00',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              What We Deliver
            </div>
            <h2 style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900,
              color: '#F0F0F0',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: 0,
            }}>
              Six Solutions.
              <br />
              One Mission:
              <br />
              <span style={{ color: '#C6FF00' }}>Your Growth.</span>
            </h2>
          </div>
          <div className={`reveal${visible ? ' visible' : ''}`} style={{ animationDelay: '0.15s' }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: '#555',
              lineHeight: 1.8,
              maxWidth: 420,
            }}>
              Every service we offer is measured against one benchmark: how much revenue
              does it generate for your business? If it can't move the needle, we won't
              recommend it. No fluff. Just what works.
            </p>
          </div>
        </div>

        {/* List */}
        <div style={{ borderTop: '1px solid #1A1A1A' }}>
          {SERVICES.map((svc, i) => (
            <ServiceRow key={svc.num} svc={svc} index={i} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────

function StatNum({ val, suf, label, delay }: { val: number; suf: string; label: string; delay: number }) {
  const { ref, visible } = useReveal()
  const count = useCountUp(val, visible)
  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' visible' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div style={{
        fontFamily: "'Urbanist', sans-serif",
        fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
        fontWeight: 900,
        color: '#F0F0F0',
        letterSpacing: '-0.04em',
        lineHeight: 1,
      }}>
        {count}<span style={{ color: '#C6FF00' }}>{suf}</span>
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: '#3A3A3A',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginTop: 12,
      }}>
        {label}
      </div>
    </div>
  )
}

function Stats() {
  return (
    <section style={{
      borderTop: '1px solid #1A1A1A',
      borderBottom: '1px solid #1A1A1A',
      padding: '100px 40px',
      background: '#090909',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
      }}>
        {[
          { val: 100, suf: '+', label: 'Businesses Served', delay: 0 },
          { val: 50, suf: '+', label: 'Engineers & Freelancers', delay: 0.1 },
          { val: 98, suf: '%', label: 'Client Retention Rate', delay: 0.2 },
          { val: 5, suf: 'x', label: 'Average Revenue Uplift', delay: 0.3 },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: '0 40px',
              borderLeft: i > 0 ? '1px solid #1A1A1A' : 'none',
            }}
          >
            <StatNum {...s} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT — PHOTO EDITORIAL
// ─────────────────────────────────────────────────────────────────────────────

function About() {
  const { ref, visible } = useReveal()
  return (
    <section style={{ padding: '120px 40px', background: '#090909' }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left: text */}
          <div className={`reveal${visible ? ' visible' : ''}`}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#C6FF00',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 32,
            }}>
              Who We Serve
            </div>
            <h2 style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
              fontWeight: 900,
              color: '#F0F0F0',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: '0 0 28px',
            }}>
              From Local Shops
              <br />
              to <span style={{ color: '#C6FF00' }}>Digital</span> Giants.
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: '#555',
              lineHeight: 1.8,
              marginBottom: 40,
            }}>
              We've built digital infrastructure for corner shops and hotel chains, solo clinics
              and multi-location practices, family restaurants and wholesale empires. Every
              client gets the same promise: we'll make your business impossible to ignore.
            </p>

            {/* Industry grid — clean text */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
              border: '1px solid #1A1A1A',
              transition: 'border-color 0.3s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C6FF00' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A1A1A' }}
            >
              {INDUSTRIES.slice(0, 8).map((ind, i) => (
                <div
                  key={ind}
                  style={{
                    padding: '16px 20px',
                    borderBottom: i < 6 ? '1px solid #1A1A1A' : 'none',
                    borderRight: i % 2 === 0 ? '1px solid #1A1A1A' : 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: '#5A5A5A',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C6FF00'
                    e.currentTarget.style.background = 'rgba(198,255,0,0.06)'
                    e.currentTarget.style.paddingLeft = '28px'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#5A5A5A'
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.paddingLeft = '20px'
                  }}
                >
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#C6FF00', flexShrink: 0, transition: 'transform 0.3s ease' }} />
                  {ind}
                </div>
              ))}
            </div>
          </div>

          {/* Right: photo */}
          <div
            className={`reveal${visible ? ' visible' : ''}`}
            style={{ animationDelay: '0.2s', position: 'relative' }}
          >
            {/* Main photo */}
            <div
              style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; const o = e.currentTarget.querySelector('.overlay') as HTMLElement; if (o) o.style.opacity = '0.3' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; const o = e.currentTarget.querySelector('.overlay') as HTMLElement; if (o) o.style.opacity = '0' }}
            >
              <img
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&h=1100&fit=crop&auto=format"
                alt="Team at work"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              {/* Color overlay on hover */}
              <div className="overlay" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(198,255,0,0.15) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Floating stat card */}
            <div style={{
              position: 'absolute',
              bottom: -20, left: -30,
              background: '#C6FF00',
              padding: '20px 28px',
            }}>
              <div style={{
                fontFamily: "'Urbanist', sans-serif",
                fontSize: 36,
                fontWeight: 900,
                color: '#090909',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}>
                5★
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: '#2A2A00',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: 4,
              }}>
                Client Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS
// ─────────────────────────────────────────────────────────────────────────────

function Process() {
  const { ref, visible } = useReveal()

  return (
    <section id="process" style={{
      borderTop: '1px solid #1A1A1A',
      padding: '120px 40px',
      background: '#0C0C0C',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={ref} style={{ marginBottom: 80 }}>
          <div className={`reveal${visible ? ' visible' : ''}`}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#C6FF00',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              How It Works
            </div>
            <h2 style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900,
              color: '#F0F0F0',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.05,
            }}>
              Four Steps.
              <br />
              <span style={{ color: '#C6FF00' }}>One</span> Outcome.
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { n: '01', title: 'Discovery', body: 'We dive deep into your business, your customers, and your goals. No assumptions — only data-driven insights that tell us exactly where to focus.' },
            { n: '02', title: 'Strategy', body: 'A custom roadmap built for your context. Not a template. Every recommendation comes with a clear, measurable outcome attached.' },
            { n: '03', title: 'Build', body: 'Designers, engineers, and AI specialists work in sync. You get weekly updates, full transparency, and zero surprises on launch day.' },
            { n: '04', title: 'Scale', body: 'Launch is just the start. We monitor, optimise, and evolve your digital infrastructure as your business grows.' },
          ].map((step, i) => {
            const { ref: sRef, visible: sv } = useReveal()
            return (
              <div
                key={step.n}
                ref={sRef}
                className={`reveal${sv ? ' visible' : ''}`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  padding: '40px 40px 40px 0',
                  borderRight: i < 3 ? '1px solid #1A1A1A' : 'none',
                  paddingLeft: i > 0 ? 40 : 0,
                }}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 48,
                  fontWeight: 400,
                  color: '#1E1E1E',
                  lineHeight: 1,
                  marginBottom: 40,
                  letterSpacing: '-0.02em',
                }}>
                  {step.n}
                </div>
                <h3 style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#F0F0F0',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#4A4A4A',
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {step.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS — CONFETTI SCROLL (WHITE PAPER CARDS ON BLACK)
// ─────────────────────────────────────────────────────────────────────────────

function ReviewPaper({
  review,
  index,
  scrollYProgress,
}: {
  review: (typeof REVIEWS)[0]
  index: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const total = REVIEWS.length
  const start = (index / total) * 0.68
  const end = Math.min(start + 0.32, 0.9)
  const fadeStart = Math.min(end + 0.05, 0.95)
  const fadeEnd = Math.min(end + 0.18, 1.0)

  const x = useTransform(scrollYProgress, [start, end], [0, review.tx])
  const y = useTransform(scrollYProgress, [start, end], [index * -2, review.ty])
  const rotate = useTransform(scrollYProgress, [start, end], [review.rotation, review.rotation + review.fr])
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.88])
  const opacity = useTransform(
    scrollYProgress,
    fadeStart < fadeEnd ? [fadeStart, fadeEnd] : [fadeStart, fadeStart],
    [1, 0.8],
  )

  return (
    <motion.div
      style={{
        x, y, rotate, scale, opacity,
        position: 'absolute',
        left: '50%', top: '50%',
        marginLeft: -160, marginTop: -110,
        zIndex: REVIEWS.length - index,
        width: 320,
      }}
    >
      <div className="paper" style={{
        width: 320,
        padding: '28px 28px 24px',
        position: 'relative',
      }}>
        {/* Accent top line */}
        <div style={{
          position: 'absolute', top: 0, left: 28, right: 28,
          height: 2, background: '#090909',
        }} />

        {/* Stars */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 12 12">
              <polygon
                points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9 3,11 3.5,7.5 1,5 4.5,4.5"
                fill="#090909"
              />
            </svg>
          ))}
        </div>

        {/* Quote */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          lineHeight: 1.7,
          color: '#1A1A1A',
          margin: '0 0 20px',
          fontStyle: 'italic',
        }}>
          "{review.text}"
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: '#E8E7E2', marginBottom: 16 }} />

        {/* Author */}
        <div>
          <div style={{
            fontFamily: "'Urbanist', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: '#090909',
            letterSpacing: '-0.01em',
          }}>
            {review.name}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginTop: 2,
          }}>
            {review.co} · {review.role}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Reviews() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref, visible } = useReveal()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="reviews" style={{ background: '#090909' }}>
      {/* Header */}
      <div ref={ref} style={{ padding: '120px 40px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div className={`reveal${visible ? ' visible' : ''}`}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#C6FF00',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            Client Stories
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'end' }}>
            <h2 style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900,
              color: '#F0F0F0',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.05,
            }}>
              100+ Businesses.
              <br />
              100+ Success
              <br />
              Stories.
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: '#4A4A4A',
              lineHeight: 1.8,
              maxWidth: 400,
            }}>
              Scroll through the stack. Real words from real business owners who
              trusted us with their growth — and never looked back.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll zone */}
      <div ref={containerRef} style={{ height: '480vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090909',
        }}>
          {/* Subtle radial light */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.4], [0, 1]),
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(198,255,0,0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Scroll hint */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [0, 1, 1, 0]),
              position: 'absolute', top: 40,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: '#2A2A2A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            scroll to reveal
          </motion.div>

          {/* Card stack */}
          <div style={{ position: 'relative', width: 320, height: 220 }}>
            {REVIEWS.map((review, i) => (
              <ReviewPaper
                key={review.id}
                review={review}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────────────────────────

function Cta() {
  const { ref, visible } = useReveal()

  return (
    <section id="contact" style={{
      borderTop: '1px solid #1A1A1A',
      padding: '140px 40px',
      background: '#090909',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Large background text */}
      <div style={{
        position: 'absolute',
        bottom: -40, right: -20,
        fontFamily: "'Urbanist', sans-serif",
        fontSize: 'clamp(8rem, 20vw, 22rem)',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.015)',
        letterSpacing: '-0.05em',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        GO.
      </div>

      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className={`reveal${visible ? ' visible' : ''}`}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#C6FF00',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 32,
          }}>
            Ready to Grow?
          </div>

          <h2 style={{
            fontFamily: "'Urbanist', sans-serif",
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            fontWeight: 900,
            color: '#F0F0F0',
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            margin: '0 0 60px',
            maxWidth: 800,
          }}>
            Ready to Build
            <br />
            <span style={{ color: '#C6FF00' }}>Your Empire</span>?
          </h2>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', marginBottom: 60 }}>
            <a
              href="mailto:techtics55@gmail.com"
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: '#090909',
                background: '#C6FF00',
                padding: '18px 40px',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Email Us
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="https://chat.whatsapp.com/COsx6RnHBa94IqswKbLR7p"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                color: '#5A5A5A',
                border: '1px solid #1E1E1E',
                padding: '18px 32px',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3A3A3A'
                e.currentTarget.style.color = '#F0F0F0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1E1E1E'
                e.currentTarget.style.color = '#5A5A5A'
              }}
            >
              Join the WhatsApp Community
            </a>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {['Free Strategy Call', 'No Lock-in Contracts', '100+ Businesses Served', '24-Hour Response'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, background: '#C6FF00' }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: '#3A3A3A',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #1A1A1A',
      padding: '60px 40px',
      background: '#090909',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: 40,
        marginBottom: 60,
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <img
              src="/logo.jpeg"
              alt="TechTics"
              style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 2 }}
            />
            <span style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: 16,
              color: '#F0F0F0',
            }}>
              TechTics
            </span>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: '#3A3A3A',
            lineHeight: 1.7,
            maxWidth: 200,
          }}>
            We build the digital infrastructure that turns local businesses into market leaders. Websites, apps, AI — built for growth.
          </p>
        </div>

        {/* Services */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#3A3A3A',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Services
          </div>
          {['Web Development', 'Mobile Apps', 'AI Automations', 'WhatsApp Bots', 'AI Agents', 'E-commerce'].map((item) => (
            <a key={item} href="#services" style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: '#3A3A3A',
              textDecoration: 'none',
              marginBottom: 10,
              transition: 'color 0.2s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#3A3A3A')}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Company */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#3A3A3A',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Company
          </div>
          {[['About', '#about'], ['Process', '#process'], ['Reviews', '#reviews'], ['For Clients', '/client/register'], ['For Developers', '/developer/register']].map(([item, href]) => (
            <Link key={item} to={href} style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: '#3A3A3A',
              textDecoration: 'none',
              marginBottom: 10,
              transition: 'color 0.2s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#3A3A3A')}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#3A3A3A',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Contact
          </div>
          <a href="mailto:techtics55@gmail.com" style={{
            display: 'block',
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: '#3A3A3A',
            textDecoration: 'none',
            marginBottom: 10,
            transition: 'color 0.2s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C6FF00')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#3A3A3A')}
          >
            techtics55@gmail.com
          </a>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #1A1A1A',
        paddingTop: 28,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: '#2A2A2A',
          letterSpacing: '0.08em',
        }}>
          © {new Date().getFullYear()} TechTics. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Privacy', 'Terms'].map((item) => (
            <a key={item} href="#" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: '#2A2A2A',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              transition: 'color 0.2s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#5A5A5A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#2A2A2A')}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <div style={{ background: '#090909', minHeight: '100vh' }}>
      <Cursor />
      <Nav />
      <Hero />
      <IndustryStrip />
      <Services />
      <Stats />
      <About />
      <Process />
      <Reviews />
      <Cta />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client/register" element={<ClientForm />} />
        <Route path="/developer/register" element={<DeveloperForm />} />
        <Route path="/client/agreement" element={<ClientAgreement />} />
        <Route path="/developer/agreement" element={<DeveloperAgreement />} />
      </Routes>
    </BrowserRouter>
  )
}
