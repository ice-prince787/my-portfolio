'use client'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, /* Increased z-index to stay above chaos elements */
      padding: '1.5rem 3rem', /* Slightly increased padding for breathing room */
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(36,30,33,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(74,155,127,0.3)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <a href="#" className="nav-punk-logo" style={{ textDecoration: 'none' }}>
        <span className="nav-punk-mark">DIPANKAR</span>
        <span className="nav-punk-dot">.DEV</span>
      </a>

      <a href="#contact" className="nav-punk-hire">
        HIRE ME →
      </a>

      <style>{`
        .nav-punk-logo {
          display: flex;
          align-items: baseline;
          gap: 0.15em;
          transform: rotate(-2deg);
        }
        .nav-punk-mark {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #C4CDB8;
          text-shadow: 2px 2px 0 #0a0a0a, -1px 0 #ff3d7f;
        }
        .nav-punk-dot {
          font-size: 0.75em;
          font-weight: 800;
          color: #ff3d7f;
          letter-spacing: 0.05em;
        }
        .nav-punk-hire {
          background: #ffe14d;
          color: #0a0a0a;
          padding: 0.45rem 1rem;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          border: 2px solid #0a0a0a;
          box-shadow: 3px 3px 0 #ff3d7f;
          transform: rotate(2deg);
          clip-path: polygon(0 0, 100% 0, 96% 100%, 4% 100%);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .nav-punk-hire:hover {
          transform: rotate(0deg) scale(1.04);
          box-shadow: 4px 4px 0 #ff3d7f;
        }
      `}</style>
    </nav>
  )
}