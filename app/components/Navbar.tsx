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
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(66,0,57,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(155,93,229,0.3)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <a href="#" style={{
        fontSize: '1.4rem', fontWeight: 800,
        background: 'linear-gradient(135deg, #9B5DE5, #F15BB5)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textDecoration: 'none'
      }}>
        Dipankar.dev
      </a>

      <a href="#contact" style={{
        background: 'linear-gradient(135deg, #9B5DE5, #F15BB5)',
        color: 'white', padding: '0.5rem 1.2rem',
        borderRadius: '8px', textDecoration: 'none',
        fontSize: '0.9rem', fontWeight: 600,
        transition: 'opacity 0.2s'
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Hire Me
      </a>
    </nav>
  )
}