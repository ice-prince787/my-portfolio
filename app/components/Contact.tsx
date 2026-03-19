'use client'
import { useEffect, useRef, useState } from 'react'

const socials = [
  {
    name: 'GitHub',
    handle: '@ice-prince787',
    url: 'https://github.com/ice-prince787',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    color: '#C4CDB8',
  },
  {
    name: 'Discord',
    handle: 'dipankar8256',
    url: 'https://discord.com/users/dipankar8256',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.085.118 18.11.143 18.126a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    color: '#5865F2',
  },
  {
    name: 'itch.io',
    handle: 'dipankarr.itch.io',
    url: 'https://dipankarr.itch.io',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.13 1.338C2.08 1.96.02 4.328 0 4.95v1.03c0 1.303 1.22 2.45 2.325 2.45 1.33 0 2.436-1.102 2.436-2.41 0 1.308 1.07 2.41 2.4 2.41 1.328 0 2.362-1.102 2.362-2.41 0 1.308 1.106 2.41 2.435 2.41h.032c1.33 0 2.434-1.102 2.434-2.41 0 1.308 1.035 2.41 2.363 2.41 1.33 0 2.4-1.102 2.4-2.41 0 1.308 1.105 2.41 2.435 2.41C22.78 8.43 24 7.282 24 5.98V4.95c-.02-.622-2.08-2.99-3.13-3.612C19.154.196 12.588 0 12 0c-.588 0-7.154.196-8.87 1.338zm8.944 7.768c-.64 0-1.22.09-1.738.244-.06.018-.12.04-.178.06C9.6 9.666 8.724 10.403 8.1 11.32L6.65 19.21c1.2.54 3.2.79 5.35.79s4.15-.25 5.35-.79l-1.45-7.89c-.625-.918-1.502-1.654-2.06-1.908a5.364 5.364 0 0 0-.178-.06 5.074 5.074 0 0 0-1.635-.246zM8.59 9.8c.02.02-1.696 1.89-1.938 5.17L5.17 14.3c.33-2.632 1.83-4.398 3.42-4.5zm6.83 0c1.59.102 3.09 1.868 3.42 4.5l-1.482.67C17.116 11.69 15.4 9.82 15.42 9.8zM12 11.33c1.34 0 2.51 1.46 2.51 3.25S13.34 17.83 12 17.83s-2.51-1.46-2.51-3.25 1.17-3.25 2.51-3.25zm-6.86 4.27l-1.99-.06c.1 2.3 1.08 3.75 2.23 4.84l1.12-1.58c-.736-.706-1.27-1.79-1.36-3.2zm13.72 0c-.09 1.41-.624 2.494-1.36 3.2l1.12 1.58c1.15-1.09 2.13-2.54 2.23-4.84zm-11.2 4.68L6.4 21.96C7.78 23.2 9.8 24 12 24s4.22-.8 5.6-2.04l-1.26-1.68C15.32 21.33 13.7 22 12 22s-3.32-.67-4.34-1.72z"/>
      </svg>
    ),
    color: '#FA5C5C',
  },
  {
    name: 'Instagram',
    handle: '@stoic_man_787',
    url: 'https://instagram.com/stoic_man_787',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    color: '#E1306C',
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
            setTimeout(() => {
              (el as HTMLElement).style.opacity = '1'
              ;(el as HTMLElement).style.transform = 'translateY(0)'
            }, i * 100)
          })
        }
      })
    }, { threshold: 0.05 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const copyDiscord = () => {
    navigator.clipboard.writeText('dipankar8256')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" ref={sectionRef} style={{
      padding: '8rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      background: '#241E21',
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Subtle radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(74,155,127,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.7s ease', marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, transparent, #4A9B7F)' }} />
            <span style={{ color: '#9DB89A', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Contact</span>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #4A9B7F, transparent)' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#C4CDB8', margin: 0, marginBottom: '1rem' }}>
            Let's{' '}
            <span style={{ background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              talk.
            </span>
          </h2>
          <p style={{ color: '#9DB89A', fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8, maxWidth: 440, margin: '0 auto' }}>
            I'm open to collabs, feedback, or just chatting about games and code.
            Hit me up anywhere below.
          </p>
        </div>

        {/* Social cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
          {socials.map((s, i) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="fade-up"
              style={{
                opacity: 0, transform: 'translateY(20px)',
                transition: `all 0.6s ease ${0.1 + i * 0.08}s`,
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.4rem',
                background: 'rgba(74,155,127,0.04)',
                border: '1px solid rgba(74,155,127,0.12)',
                borderRadius: 14, textDecoration: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(74,155,127,0.09)'
                e.currentTarget.style.borderColor = 'rgba(74,155,127,0.35)'
                e.currentTarget.style.transform = 'translateX(6px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(74,155,127,0.04)'
                e.currentTarget.style.borderColor = 'rgba(74,155,127,0.12)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              {/* Icon */}
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: `${s.color}18`,
                border: `1px solid ${s.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color,
              }}>
                {s.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#C4CDB8', marginBottom: '0.1rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#9DB89A', fontFamily: 'monospace', opacity: 0.7 }}>{s.handle}</div>
              </div>

              {/* Arrow */}
              <div style={{ color: 'rgba(74,155,127,0.4)', fontSize: '1.1rem' }}>→</div>
            </a>
          ))}

          {/* Discord copy card */}
          <div
            className="fade-up"
            onClick={copyDiscord}
            style={{
              opacity: 0, transform: 'translateY(20px)',
              transition: `all 0.6s ease 0.34s`,
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.4rem',
              background: copied ? 'rgba(74,155,127,0.12)' : 'rgba(74,155,127,0.04)',
              border: `1px solid ${copied ? 'rgba(74,155,127,0.4)' : 'rgba(74,155,127,0.12)'}`,
              borderRadius: 14, cursor: 'pointer'
            }}
            onMouseEnter={e => {
              if (!copied) {
                e.currentTarget.style.background = 'rgba(74,155,127,0.09)'
                e.currentTarget.style.borderColor = 'rgba(74,155,127,0.35)'
              }
            }}
            onMouseLeave={e => {
              if (!copied) {
                e.currentTarget.style.background = 'rgba(74,155,127,0.04)'
                e.currentTarget.style.borderColor = 'rgba(74,155,127,0.12)'
              }
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 10, flexShrink: 0,
              background: 'rgba(88,101,242,0.15)',
              border: '1px solid rgba(88,101,242,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>
              📋
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#C4CDB8', marginBottom: '0.1rem' }}>Copy Discord Tag</div>
              <div style={{ fontSize: '0.8rem', color: '#9DB89A', fontFamily: 'monospace', opacity: 0.7 }}>dipankar8256</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: copied ? '#4A9B7F' : 'rgba(74,155,127,0.4)', fontWeight: 600, transition: 'color 0.2s' }}>
              {copied ? '✓ copied!' : 'click to copy'}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="fade-up" style={{
          opacity: 0, transform: 'translateY(16px)', transition: 'all 0.6s ease 0.5s',
          textAlign: 'center', color: '#9DB89A', fontSize: '0.78rem', 
        }}>
          Built by Dipankar · 2024 · Next.js + Three.js
        </div>
      </div>
    </section>
  )
}