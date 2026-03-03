'use client'
import { useEffect, useState, useRef } from 'react'

const roles = ['Full-Stack Developer', 'React Enthusiast', 'Problem Solver', 'Open to Work']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)

  // Typing animation
  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: ReturnType<typeof setTimeout>
    if (typing) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
      } else {
        timeout = setTimeout(() => setTyping(false), 1800)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
      } else {
        setRoleIndex((i) => (i + 1) % roles.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, roleIndex])

  // Interactive particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initParticles()
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    type Particle = {
      x: number; y: number; baseX: number; baseY: number
      size: number; color: string; vx: number; vy: number
    }

    const colors = ['#9B5DE5', '#F15BB5', '#FEE440', '#c9b8d8']
    let particles: Particle[] = []

    const initParticles = () => {
      particles = []
      const cols = Math.floor(width / 80)
      const rows = Math.floor(height / 80)
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i / cols) * width + 40
          const y = (j / rows) * height + 40
          particles.push({
            x, y, baseX: x, baseY: y,
            size: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: 0, vy: 0
          })
        }
      }
    }

    initParticles()

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const mouse = mouseRef.current
      const RADIUS = 120
      const STRENGTH = 6

      for (const p of particles) {
        const dx = mouse.x - p.baseX
        const dy = mouse.y - p.baseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < RADIUS) {
          const force = (RADIUS - dist) / RADIUS
          const angle = Math.atan2(dy, dx)
          const targetX = p.baseX - Math.cos(angle) * force * STRENGTH * 12
          const targetY = p.baseY - Math.sin(angle) * force * STRENGTH * 12
          p.vx += (targetX - p.x) * 0.18
          p.vy += (targetY - p.y) * 0.18
        } else {
          p.vx += (p.baseX - p.x) * 0.08
          p.vy += (p.baseY - p.y) * 0.08
        }

        p.vx *= 0.82
        p.vy *= 0.82
        p.x += p.vx
        p.y += p.vy

        // Draw connections
        for (const p2 of particles) {
          const dx2 = p.x - p2.x
          const dy2 = p.y - p2.y
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
          if (d2 < 90 && d2 > 0) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(155,93,229,${0.12 * (1 - d2 / 90)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }

        // Draw dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.7
        ctx.fill()
        ctx.globalAlpha = 1
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Interactive particle canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Content */}
      <div style={{ textAlign: 'center', maxWidth: '800px', zIndex: 1, position: 'relative' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(254,228,64,0.12)',
          border: '1px solid rgba(254,228,64,0.4)',
          borderRadius: '100px', padding: '0.4rem 1.2rem',
          fontSize: '0.85rem', color: '#FEE440',
          marginBottom: '1.8rem', fontWeight: 500,
        }}>
          ✨ Available for new opportunities
        </div>

        {/* Name */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 800, lineHeight: 1.1,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #F6F2FF 0%, #9B5DE5 50%, #F15BB5 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Hi, I'm Dipankar
        </h1>

        {/* Typing animation */}
        <div style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          fontWeight: 600, marginBottom: '1.5rem',
          minHeight: '2.5rem'
        }}>
          <span style={{ color: '#F15BB5' }}>{'< '}</span>
          <span style={{ color: '#F6F2FF' }}>{displayed}</span>
          <span style={{
            display: 'inline-block', width: '2px', height: '1.2em',
            background: '#FEE440', marginLeft: '2px',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite'
          }} />
          <span style={{ color: '#F15BB5' }}>{' />'}</span>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: '#c9b8d8', maxWidth: '560px',
          margin: '0 auto 2.5rem', lineHeight: 1.7
        }}>
          I build fast, beautiful, and scalable web apps that people actually enjoy using.
          Let's turn your ideas into reality.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#projects" style={{
            background: 'linear-gradient(135deg, #9B5DE5, #F15BB5)',
            color: 'white', padding: '0.85rem 2rem',
            borderRadius: '12px', textDecoration: 'none',
            fontSize: '1rem', fontWeight: 600,
            boxShadow: '0 0 30px rgba(155,93,229,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 45px rgba(241,91,181,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(155,93,229,0.4)'
            }}
          >
            View My Work 🚀
          </a>
          <a href="#contact" style={{
            background: 'transparent',
            color: '#FEE440', padding: '0.85rem 2rem',
            borderRadius: '12px', textDecoration: 'none',
            fontSize: '1rem', fontWeight: 600,
            border: '1px solid rgba(254,228,64,0.5)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(254,228,64,0.1)'
              e.currentTarget.style.borderColor = '#FEE440'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(254,228,64,0.5)'
            }}
          >
            Get In Touch 💌
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: '4rem', color: '#c9b8d8', fontSize: '0.85rem' }}>
          <div style={{
            width: '1px', height: '50px',
            background: 'linear-gradient(to bottom, #9B5DE5, transparent)',
            margin: '0 auto 0.5rem'
          }} />
          scroll down
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}