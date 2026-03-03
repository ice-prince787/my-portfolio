'use client'
import { useEffect, useRef, useState } from 'react'
import { Layers, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

// Updated Project Data with your specific image names
const projects = [
  {
    title: 'Neon Dash',
    description: 'Synthwave endless runner built in Unity with smooth movement, scoring system and neon bloom visuals.',
    tech: ['Unity', 'C#', 'URP'],
    screenshots: ['/neonrunner1.png', '/neonrunner2.png']
  },
  {
    title: 'Brick Breaker',
    description: 'A classic arcade experience reimagined with physics-based collisions, power-ups, and progressive difficulty levels.',
    tech: ['C#', 'Unity', 'Game Physics'],
    screenshots: ['/brickbreaker1.png', '/brickbreaker2.png']
  }
]

function ProjectBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.3, overflow: 'hidden' }}>
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
  const [activeGallery, setActiveGallery] = useState<string[] | null>(null)
  const [[page, direction], setPage] = useState([0, 0])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
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
    }, { threshold: 0.1 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const paginate = (newDirection: number) => {
    if (!activeGallery) return
    const nextImage = (page + newDirection + activeGallery.length) % activeGallery.length
    setPage([nextImage, newDirection])
  }

  // Animation Variants with Explicit Typing to solve the TS error
  const imageVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  }

  return (
    <section id="projects" ref={sectionRef} style={{ padding: '8rem 2rem', position: 'relative', overflow: 'hidden', background: '#241E21' }}>
      <ProjectBackground />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="fade-up" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s ease', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '2px', background: '#4A9B7F' }} />
            <span style={{ color: '#9DB89A', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Portfolio</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#C4CDB8', margin: 0 }}>
            Featured <span style={{ color: '#4A9B7F' }}>Projects</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>
          {projects.map((proj, i) => (
            <div key={i} className="fade-up" style={{
              opacity: 0, transform: 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
              background: 'rgba(45, 79, 71, 0.15)', border: '1px solid rgba(74, 155, 127, 0.2)',
              borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4A9B7F'; e.currentTarget.style.transform = 'translateY(-10px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(74, 155, 127, 0.2)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ height: '240px', width: '100%', background: '#1A1A1A', position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(74, 155, 127, 0.3)' }}>
                  <Layers size={64} />
                </div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ color: '#C4CDB8', fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>{proj.title}</h3>
                <p style={{ color: '#9DB89A', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{proj.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.5rem' }}>
                  {proj.tech.map(t => (
                    <span key={t} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', background: 'rgba(74, 155, 127, 0.1)', color: '#4A9B7F', border: '1px solid rgba(74, 155, 127, 0.2)', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <button 
                  onClick={() => { setActiveGallery(proj.screenshots); setPage([0, 0]); document.body.style.overflow = 'hidden'; }}
                  style={{ width: '100%', background: 'rgba(74, 155, 127, 0.1)', color: '#C4CDB8', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(74, 155, 127, 0.5)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#4A9B7F'; e.currentTarget.style.color = '#241E21' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74, 155, 127, 0.1)'; e.currentTarget.style.color = '#C4CDB8' }}
                >
                  <ImageIcon size={18} /> View Screenshots
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeGallery && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(36, 30, 33, 0.98)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            
            <div style={{ position: 'relative', width: '100%', maxWidth: '900px' }}>
              
              {/* Close Button - Positioned to the side of the container */}
              <button 
                onClick={() => { setActiveGallery(null); document.body.style.overflow = 'auto'; }} 
                style={{ 
                  position: 'absolute', top: '-60px', right: '0', 
                  background: 'none', border: '1px solid #4A9B7F', 
                  borderRadius: '50%', color: '#4A9B7F', padding: '8px', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', transition: 'all 0.2s' 
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(74, 155, 127, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <X size={28} />
              </button>

              <div style={{ 
                position: 'relative', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', overflow: 'hidden', borderRadius: '24px', 
                border: '2px solid rgba(74, 155, 127, 0.4)', background: '#111',
                boxShadow: '0 0 50px rgba(0,0,0,0.5)'
              }}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={page}
                    src={activeGallery[page]}
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                  />
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={() => paginate(-1)} 
                style={{ position: 'absolute', left: '-70px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(74, 155, 127, 0.1)', border: '1px solid #4A9B7F', borderRadius: '50%', color: '#C4CDB8', padding: '12px', cursor: 'pointer' }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => paginate(1)} 
                style={{ position: 'absolute', right: '-70px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(74, 155, 127, 0.1)', border: '1px solid #4A9B7F', borderRadius: '50%', color: '#C4CDB8', padding: '12px', cursor: 'pointer' }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}