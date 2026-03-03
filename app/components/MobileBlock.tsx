'use client'
import { useState, useEffect } from 'react'
import { Monitor, Smartphone } from 'lucide-react'

export default function MobileBlock() {
  const [isMobile, setIsMobile] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isMobile || dismissed) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(36,30,33,0.97)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,155,127,0.2) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Icons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        position: 'relative',
      }}>
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '16px',
          background: 'rgba(74,155,127,0.15)',
          border: '1px solid rgba(74,155,127,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.5,
        }}>
          <Smartphone size={32} color="#4A9B7F" />
        </div>

        <div style={{ color: '#9DB89A', fontSize: '1.5rem' }}>→</div>

        <div style={{
          width: '72px', height: '72px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(74,155,127,0.3), rgba(157,184,154,0.2))',
          border: '1px solid rgba(74,155,127,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(74,155,127,0.3)',
        }}>
          <Monitor size={36} color="#9DB89A" />
        </div>
      </div>

      {/* Text */}
      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #C4CDB8, #4A9B7F, #9DB89A)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
        lineHeight: 1.2,
        position: 'relative',
      }}>
        Best experienced<br />on Desktop
      </h1>

      <p style={{
        color: '#9DB89A',
        fontSize: '1rem',
        lineHeight: 1.7,
        maxWidth: '300px',
        marginBottom: '2.5rem',
        position: 'relative',
      }}>
        This portfolio has interactive 3D elements and animations that are designed for a larger screen. Open it on your laptop or PC for the full experience! 💻
      </p>

      {/* URL chip */}
      <div style={{
        background: 'rgba(74,155,127,0.12)',
        border: '1px solid rgba(74,155,127,0.35)',
        borderRadius: '100px',
        padding: '0.5rem 1.2rem',
        fontSize: '0.85rem',
        color: '#4A9B7F',
        fontWeight: 600,
        marginBottom: '2rem',
        position: 'relative',
        letterSpacing: '0.02em',
      }}>
        dipankar.dev
      </div>

      {/* Continue anyway button */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9DB89A',
          fontSize: '0.85rem',
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          opacity: 0.7,
          position: 'relative',
        }}
      >
        Continue anyway
      </button>
    </div>
  )
}