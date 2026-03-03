'use client'
import { useEffect, useRef } from 'react'
import { Layers, Image as ImageIcon } from 'lucide-react'

const projects = [
  {
    title: 'Neon Dash',
    description: 'Synthwave endless runner built in Unity with smooth movement, scoring system and neon bloom visuals.',
    tech: ['Unity', 'C#', 'URP'],
    image: '/api/placeholder/600/400'
  },
  {
    title: 'Alien Planet Courier',
    description: 'Procedural 2D delivery game built with Pygame featuring animated sprites and custom UI systems.',
    tech: ['Python', 'Pygame', 'Game Design'],
    image: '/api/placeholder/600/400'
  }
]

function ProjectBackground() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.3,
      overflow: 'hidden'
    }}>
      {/* Background Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(rgba(74, 155, 127, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(74, 155, 127, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px'
      }} />

      {/* Dynamic Multi-Angle Beams */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`beam beam-${i}`} style={{
          position: 'absolute',
          height: '1px',
          width: '100%',
          background: 'linear-gradient(90deg, transparent, #4A9B7F, transparent)',
          opacity: 0,
          transform: `rotate(${i * 45}deg)`,
        }} />
      ))}

      <style>{`
        @keyframes sweep {
          0% { transform: translate(-100%, -100%) rotate(var(--rot)); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translate(100%, 100%) rotate(var(--rot)); opacity: 0; }
        }
        .beam-0 { --rot: 45deg; animation: sweep 12s linear infinite; top: 0; left: 0; }
        .beam-1 { --rot: -45deg; animation: sweep 15s linear infinite 2s; top: 0; right: 0; }
        .beam-2 { --rot: 10deg; animation: sweep 10s linear infinite 5s; bottom: 10%; left: 0; }
        .beam-3 { --rot: -20deg; animation: sweep 18s linear infinite 1s; top: 30%; right: 0; }
      `}</style>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1'
                ;(el as HTMLElement).style.transform = 'translateY(0)'
              }, i * 150)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" ref={sectionRef} style={{
      padding: '8rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      background: '#241E21' // Your project bg
    }}>
      <ProjectBackground />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div className="fade-up" style={{
          opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s ease',
          marginBottom: '4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '2px', background: '#4A9B7F' }} />
            <span style={{ color: '#9DB89A', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Portfolio
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#C4CDB8', margin: 0 }}>
            Featured <span style={{ color: '#4A9B7F' }}>Projects</span>
          </h2>
        </div>

        {/* Projects Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2.5rem'
        }}>
          {projects.map((proj, i) => (
            <div
              key={i}
              className="fade-up"
              style={{
                opacity: 0, transform: 'translateY(40px)',
                transition: 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
                background: 'rgba(45, 79, 71, 0.15)', // dark green base
                border: '1px solid rgba(74, 155, 127, 0.2)',
                borderRadius: '24px',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#4A9B7F'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(74, 155, 127, 0.1)'
                e.currentTarget.style.transform = 'translateY(-10px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(74, 155, 127, 0.2)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Image Preview Container */}
              <div style={{ 
                height: '240px', width: '100%', background: '#1A1A1A', 
                position: 'relative', overflow: 'hidden',
                borderBottom: '1px solid rgba(74, 155, 127, 0.1)'
              }}>
                <div style={{
                  position: 'absolute', inset: 0, 
                  background: `linear-gradient(to bottom, transparent, rgba(36,30,33,0.8))`,
                  zIndex: 1
                }} />
                <div style={{
                  height: '100%', width: '100%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(74, 155, 127, 0.3)'
                }}>
                  <Layers size={64} />
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '2rem' }}>
                <h3 style={{ color: '#C4CDB8', fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                  {proj.title}
                </h3>
                <p style={{ color: '#9DB89A', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  {proj.description}
                </p>

                {/* Tech Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.5rem' }}>
                  {proj.tech.map(t => (
                    <span key={t} style={{
                      padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem',
                      background: 'rgba(74, 155, 127, 0.1)', color: '#4A9B7F',
                      border: '1px solid rgba(74, 155, 127, 0.2)', fontWeight: 600
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Updated Screenshots Button */}
                <button 
                  style={{
                    width: '100%',
                    background: 'rgba(74, 155, 127, 0.1)',
                    color: '#C4CDB8',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(74, 155, 127, 0.5)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#4A9B7F'
                    e.currentTarget.style.color = '#241E21'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(74, 155, 127, 0.1)'
                    e.currentTarget.style.color = '#C4CDB8'
                  }}
                >
                  <ImageIcon size={18} />
                  View Screenshots
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}