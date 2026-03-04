'use client'
import { useEffect, useRef } from 'react'

/**
 * SKILLS BACKGROUND COMPONENT
 * A canvas-based interactive background that simulates data pulses
 * traveling along a circuit grid.
 */

function WrenchScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
    let h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight

    const onResize = () => {
      w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const HEAD_DIST = 46

    type Bolt = {
      x: number; y: number
      rot: number
      screwDepth: number
      floatOff: number
      done: boolean
      fadeOut: number
    }

    // Margin positions — bolts only here, never over cards
    // Fixed slots — each has a permanent position and an occupied flag
    // Positions chosen to be in safe margins, never behind navbar or cards
    type Slot = { x: number; y: number; occupied: boolean }
    const slots: Slot[] = [
      { x: w * 0.04, y: h * 0.20, occupied: false },
      { x: w * 0.04, y: h * 0.42, occupied: false },
      { x: w * 0.04, y: h * 0.65, occupied: false },
      { x: w * 0.04, y: h * 0.85, occupied: false },
      { x: w * 0.96, y: h * 0.20, occupied: false },
      { x: w * 0.96, y: h * 0.42, occupied: false },
      { x: w * 0.96, y: h * 0.65, occupied: false },
      { x: w * 0.96, y: h * 0.85, occupied: false },
      { x: w * 0.30, y: h * 0.16, occupied: false },
      { x: w * 0.70, y: h * 0.16, occupied: false },
      { x: w * 0.50, y: h * 0.16, occupied: false },
    ]

    // Spawn a bolt in a random FREE slot — if all full, do nothing
    const spawnBolt = (): Bolt | null => {
      const freeSlots = slots.filter(s => !s.occupied)
      if (freeSlots.length === 0) return null
      const slot = freeSlots[Math.floor(Math.random() * freeSlots.length)]
      slot.occupied = true
      return { x: slot.x, y: slot.y, rot: Math.random() * Math.PI * 2, screwDepth: 0, floatOff: Math.random() * Math.PI * 2, done: false, fadeOut: 0 }
    }

    // Free the slot when a bolt is screwed
    const freeSlot = (bolt: Bolt) => {
      const slot = slots.find(s => Math.round(s.x) === Math.round(bolt.x) && Math.round(s.y) === Math.round(bolt.y))
      if (slot) slot.occupied = false
    }

    // Start with 3 bolts in fixed slots
    const bolts: Bolt[] = []
    ;[ slots[1], slots[5], slots[10] ].forEach(slot => {
      slot.occupied = true
      bolts.push({ x: slot.x, y: slot.y, rot: 0, screwDepth: 0, floatOff: Math.random() * Math.PI * 2, done: false, fadeOut: 1 })
    })

    const wr = {
      x: 180, y: 140,
      angle: 0.5,
      vx: 0.6, vy: 0.4,
      rotVel: 0.007,
      dragging: false,
      offX: 0, offY: 0,
      snapped: null as Bolt | null,
      prevMouseAngle: 0,
    }

    const mouse = { x: -999, y: -999 }

    const onMouseDown = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      const mx = e.clientX - r.left, my = e.clientY - r.top
      if (Math.hypot(mx - wr.x, my - wr.y) < 65) {
        wr.dragging = true
        wr.offX = wr.x - mx; wr.offY = wr.y - my
        wr.vx = 0; wr.vy = 0
        if (wr.snapped) {
          wr.prevMouseAngle = Math.atan2(my - wr.snapped.y, mx - wr.snapped.x)
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
      if (!wr.dragging) return

      if (wr.snapped) {
        const bolt = wr.snapped
        const mouseAngle = Math.atan2(mouse.y - bolt.y, mouse.x - bolt.x)
        let delta = mouseAngle - wr.prevMouseAngle
        if (delta >  Math.PI) delta -= Math.PI * 2
        if (delta < -Math.PI) delta += Math.PI * 2

        // Wrench BODY swings around bolt — head stays pinned on bolt
        wr.angle += delta
        bolt.rot  += delta
        if (delta > 0.001) {
          bolt.screwDepth = Math.min(1, bolt.screwDepth + delta * 0.18)
        }
        // Reposition wrench so head stays locked on bolt
        wr.x = bolt.x - Math.cos(wr.angle) * HEAD_DIST
        wr.y = bolt.y - Math.sin(wr.angle) * HEAD_DIST
        wr.prevMouseAngle = mouseAngle
      } else {
        wr.x = mouse.x + wr.offX
        wr.y = mouse.y + wr.offY
      }
    }

    const onMouseUp = () => {
      if (wr.dragging && !wr.snapped) { wr.vx = 0.3; wr.vy = 0.3 }
      wr.dragging = false
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    const drawWrench = (x: number, y: number, angle: number, glow: boolean) => {
      ctx.save()
      ctx.translate(x, y); ctx.rotate(angle)
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      const col = glow ? '#4A9B7F' : '#9DB89A'
      if (glow) { ctx.shadowColor = '#4A9B7F'; ctx.shadowBlur = 22 }
      ctx.beginPath(); ctx.moveTo(-38, 0); ctx.lineTo(HEAD_DIST, 0)
      ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.stroke()
      ctx.beginPath(); ctx.arc(HEAD_DIST, 0, 13, 0, Math.PI * 2)
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke()
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2
        i === 0 ? ctx.moveTo(HEAD_DIST + Math.cos(a)*7, Math.sin(a)*7)
                : ctx.lineTo(HEAD_DIST + Math.cos(a)*7, Math.sin(a)*7)
      }
      ctx.closePath(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.beginPath(); ctx.arc(-38, 0, 9, 0, Math.PI * 2)
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke()
      ctx.shadowBlur = 0; ctx.restore()
    }

    const R = 17
    const drawBolt = (bolt: Bolt, t: number) => {
      if (bolt.fadeOut <= 0) return
      const floatY = Math.sin(t + bolt.floatOff) * 5
      const bx = bolt.x, by = bolt.y + floatY
      const scale = bolt.screwDepth >= 1 ? Math.max(0, 1 - (bolt.screwDepth - 1) * 6) : 1

      ctx.save()
      ctx.globalAlpha = bolt.fadeOut
      ctx.translate(bx, by); ctx.rotate(bolt.rot); ctx.scale(scale, scale)
      const col = bolt.screwDepth > 0 ? '#4A9B7F' : '#9DB89A'
      if (bolt.screwDepth > 0 && bolt.screwDepth < 1) { ctx.shadowColor = '#4A9B7F'; ctx.shadowBlur = 18 }
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6
        i === 0 ? ctx.moveTo(Math.cos(a)*R, Math.sin(a)*R)
                : ctx.lineTo(Math.cos(a)*R, Math.sin(a)*R)
      }
      ctx.closePath()
      ctx.fillStyle = col + '30'; ctx.fill()
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke()
      ctx.strokeStyle = '#2D4F47'; ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(-R*0.55,0); ctx.lineTo(R*0.55,0)
      ctx.moveTo(0,-R*0.55); ctx.lineTo(0,R*0.55)
      ctx.stroke()
      ctx.shadowBlur = 0; ctx.restore()

      // Speech bubble (unrotated)
      if (bolt.fadeOut > 0.2) {
        const label = bolt.screwDepth >= 1 ? 'Thanks!! 🔩' : 'Screw me human!'
        const isActive = wr.snapped === bolt || bolt.screwDepth > 0
        ctx.save()
        ctx.globalAlpha = bolt.fadeOut
        ctx.font = '600 10px sans-serif'
        const tw = ctx.measureText(label).width
        const bw = tw + 14, bh = 20
        const lx = bx - bw/2, ly = by - R - bh - 12
        ctx.fillStyle = isActive ? 'rgba(74,155,127,0.9)' : 'rgba(36,30,33,0.88)'
        ctx.strokeStyle = isActive ? '#4A9B7F' : '#9DB89A44'
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.roundRect(lx, ly, bw, bh, 5); ctx.fill(); ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(bx-4, ly+bh); ctx.lineTo(bx+4, ly+bh); ctx.lineTo(bx, ly+bh+5)
        ctx.closePath()
        ctx.fillStyle = isActive ? 'rgba(74,155,127,0.9)' : 'rgba(36,30,33,0.88)'; ctx.fill()
        ctx.fillStyle = '#C4CDB8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(label, bx, ly + bh/2)
        ctx.restore()
      }
    }

    const SNAP_DIST = 52
    let frameId: number

    const tick = (t: number) => {
      frameId = requestAnimationFrame(tick)
      ctx.clearRect(0, 0, w, h)

      // Starfield
      ctx.fillStyle = 'rgba(196,205,184,0.06)'
      for (let i = 0; i < 55; i++) {
        ctx.beginPath(); ctx.arc((i*179+33)%w, (i*113+55)%h, 1, 0, Math.PI*2); ctx.fill()
      }

      const tt = t * 0.001

      // Fade done bolts out, fade new bolts in
      for (const bolt of bolts) {
        if (bolt.done) bolt.fadeOut = Math.max(0, bolt.fadeOut - 0.012)
      }

      // Free-float (About-section style)
      if (!wr.dragging && !wr.snapped) {
        wr.x += wr.vx; wr.y += wr.vy
        wr.vy += 0.004; wr.vx *= 0.998
        wr.angle += wr.rotVel  // spins on its OWN axis while floating freely
        if (wr.x < 45)   { wr.x = 45;   wr.vx =  Math.abs(wr.vx) * 0.8 }
        if (wr.x > w-45) { wr.x = w-45; wr.vx = -Math.abs(wr.vx) * 0.8 }
        if (wr.y < 45)   { wr.y = 45;   wr.vy =  Math.abs(wr.vy) * 0.8 }
        if (wr.y > h-45) { wr.y = h-45; wr.vy = -Math.abs(wr.vy) * 0.6 }
      }

      // Head position
      const headX = wr.x + Math.cos(wr.angle) * HEAD_DIST
      const headY = wr.y + Math.sin(wr.angle) * HEAD_DIST

      // Auto-snap when head gets close to a bolt
      if (!wr.snapped) {
        for (const bolt of bolts) {
          if (bolt.done) continue
          const floatY = Math.sin(tt + bolt.floatOff) * 5
          if (Math.hypot(headX - bolt.x, headY - (bolt.y + floatY)) < SNAP_DIST) {
            wr.snapped = bolt
            wr.vx = 0; wr.vy = 0; wr.rotVel = 0
            wr.x = bolt.x - Math.cos(wr.angle) * HEAD_DIST
            wr.y = (bolt.y + floatY) - Math.sin(wr.angle) * HEAD_DIST
            wr.prevMouseAngle = Math.atan2(mouse.y - bolt.y, mouse.x - bolt.x)
            break
          }
        }
      }

      // Keep head locked on bolt when snapped & not dragging
      if (wr.snapped && !wr.dragging) {
        const bolt = wr.snapped
        const floatY = Math.sin(tt + bolt.floatOff) * 5
        wr.x = bolt.x - Math.cos(wr.angle) * HEAD_DIST
        wr.y = (bolt.y + floatY) - Math.sin(wr.angle) * HEAD_DIST
      }

      // Bolt fully screwed → free its slot, release wrench, spawn new bolt in a different free slot
      if (wr.snapped && wr.snapped.screwDepth >= 1) {
        const screwed = wr.snapped
        freeSlot(screwed)   // mark slot as free again
        screwed.done = true
        wr.snapped = null
        wr.vx = (Math.random() - 0.5) * 1.5
        wr.vy = -1.2
        wr.rotVel = 0.015
        // Spawn in a different free slot (not the same one — freeSlot already freed it
        // but spawnBolt picks randomly so we temporarily re-occupy to avoid same spot)
        screwed.done = true
        const fresh = spawnBolt()   // picks any free slot
        if (fresh) {
          bolts.push(fresh)
          const fadeInInterval = setInterval(() => {
            fresh.fadeOut = Math.min(1, fresh.fadeOut + 0.04)
            if (fresh.fadeOut >= 1) clearInterval(fadeInInterval)
          }, 16)
        }
      }

      for (const bolt of bolts) drawBolt(bolt, tt)
      drawWrench(wr.x, wr.y, wr.angle, wr.snapped !== null)

      const distToWrench = Math.hypot(mouse.x - wr.x, mouse.y - wr.y)
      document.body.style.cursor = wr.dragging ? 'grabbing' : distToWrench < 65 ? 'grab' : 'default'
    }

    requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', onResize)
      document.body.style.cursor = 'default'
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}


const skillCategories = [
  {
    title: 'Web Development',
    icon: '🌐',
    color: '#4A9B7F',
    skills: [
      { name: 'HTML',              tag: 'Strong'      },
      { name: 'CSS',               tag: 'Strong'      },
      { name: 'JavaScript',        tag: 'Comfortable' },
      { name: 'React',             tag: 'Comfortable' },
      { name: 'Next.js',           tag: 'Learning'    },
      { name: 'Anime.js',          tag: 'Comfortable' },
    ]
  },
  {
    title: 'Game Development',
    icon: '🎮',
    color: '#9DB89A',
    skills: [
      { name: 'Unity (URP)',        tag: 'Strong'      },
      { name: 'C#',                 tag: 'Comfortable' },
      { name: 'Python',             tag: 'Comfortable' },
      { name: 'Pygame',             tag: 'Comfortable' },
      { name: 'Game Architecture',  tag: 'Learning'    },
      { name: 'Movement Systems',   tag: 'Strong'      },
    ]
  },
  {
    title: 'Tools & Workflow',
    icon: '🛠',
    color: '#C4CDB8',
    skills: [
      { name: 'Git',                tag: 'Comfortable' },
      { name: 'VS Code',            tag: 'Strong'      },
      { name: 'Unity Editor',       tag: 'Strong'      },
      { name: 'Figma',              tag: 'Learning'    },
      { name: 'Three.js',           tag: 'Learning'    },
    ]
  },
]

const tagStyles: Record<string, { bg: string; color: string; label: string }> = {
  Strong:      { bg: 'rgba(74,155,127,0.18)',  color: '#4A9B7F',  label: 'Strong'      },
  Comfortable: { bg: 'rgba(157,184,154,0.15)', color: '#9DB89A',  label: 'Comfortable' },
  Learning:    { bg: 'rgba(196,205,184,0.12)', color: '#C4CDB8',  label: 'Learning'    },
}

function SkillTag({ name, tag }: { name: string; tag: string }) {
  const style = tagStyles[tag]
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 0.75rem',
      borderRadius: '10px',
      marginBottom: '0.5rem',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(74,155,127,0.1)',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(74,155,127,0.07)'
        e.currentTarget.style.borderColor = 'rgba(74,155,127,0.25)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        e.currentTarget.style.borderColor = 'rgba(74,155,127,0.1)'
      }}
    >
      <span style={{ color: '#C4CDB8', fontSize: '0.88rem', fontWeight: 500 }}>{name}</span>
      <span style={{
        fontSize: '0.72rem', fontWeight: 700,
        padding: '0.18rem 0.6rem',
        borderRadius: '100px',
        background: style.bg,
        color: style.color,
        letterSpacing: '0.04em',
        border: `1px solid ${style.color}44`,
      }}>
        {style.label}
      </span>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-in').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1'
                ;(el as HTMLElement).style.transform = 'translateY(0)'
              }, i * 100)
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
    <section id="skills" ref={sectionRef} style={{
      padding: '8rem 2rem',
      position: 'relative', // Necessary for absolute canvas positioning
      overflow: 'hidden', // Keeps the canvas contained
    }}>
      
      {/* WRENCH & BOLTS BACKGROUND */}
      <WrenchScene />

      {/* CONTENT CONTAINER */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1 // Keeps UI interactive and above the background
      }}>
        {/* Section label */}
        <div className="fade-in" style={{
          opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
          display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'
        }}>
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #4A9B7F, #9DB89A)' }} />
          <span style={{ color: '#9DB89A', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Skills
          </span>
        </div>

        {/* Heading */}
        <h2 className="fade-in" style={{
          opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
          marginBottom: '3.5rem', color: '#C4CDB8'
        }}>
          What I work with<br />
          <span style={{
            background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>every day.</span>
        </h2>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // More responsive grid
          gap: '1.5rem',
        }}>
          {skillCategories.map((cat, ci) => (
            <div
              key={ci}
              className="fade-in"
             style={{
                     opacity: 0, transform: 'translateY(30px)',
                     background: 'rgba(36,30,33,0.6)', // Darker translucent background to pop against canvas
                     backdropFilter: 'blur(8px)',
                     border: `1px solid ${cat.color}33`,
                     borderRadius: '24px',
                     padding: '1.8rem',
                     transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s',
                  }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${cat.color}88`
                e.currentTarget.style.boxShadow = `0 8px 40px ${cat.color}22`
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${cat.color}33`
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Card header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${cat.color}22`,
                  border: `1px solid ${cat.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                }}>
                  {cat.icon}
                </div>
                <h3 style={{
                  color: '#C4CDB8', fontWeight: 700, fontSize: '1rem',
                  lineHeight: 1.2,
                }}>
                  {cat.title}
                </h3>
              </div>

              {/* Skill tags */}
              {cat.skills.map((skill, si) => (
                <SkillTag
                  key={si}
                  name={skill.name}
                  tag={skill.tag}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="fade-in" style={{
          opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
          textAlign: 'center', marginTop: '3rem',
          color: '#9DB89A', fontSize: '0.9rem',
          fontStyle: 'italic',
        }}>
          Always learning — always building 🚀
        </div>
      </div>
    </section>
  )}