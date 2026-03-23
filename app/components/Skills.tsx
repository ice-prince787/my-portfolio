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

    let stars = Array.from({ length: 55 }, (_, i) => ({
      x: (i * 179 + 33) % w,
      y: (i * 113 + 55) % h,
      r: i % 5 === 0 ? 1.2 : 0.9,
      alpha: 0.035 + (i % 4) * 0.01,
    }))

    const onResize = () => {
      w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
      stars = Array.from({ length: 55 }, (_, i) => ({
        x: (i * 179 + 33) % w,
        y: (i * 113 + 55) % h,
        r: i % 5 === 0 ? 1.2 : 0.9,
        alpha: 0.035 + (i % 4) * 0.01,
      }))
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
      fadeDir: 1 | -1 | 0
    }
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number }

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
      return { x: slot.x, y: slot.y, rot: Math.random() * Math.PI * 2, screwDepth: 0, floatOff: Math.random() * Math.PI * 2, done: false, fadeOut: 0, fadeDir: 1 }
    }

    // Free the slot when a bolt is screwed
    const freeSlot = (bolt: Bolt) => {
      const slot = slots.find(s => Math.round(s.x) === Math.round(bolt.x) && Math.round(s.y) === Math.round(bolt.y))
      if (slot) slot.occupied = false
    }

    // Start with 3 bolts in fixed slots
    const bolts: Bolt[] = []
    const sparks: Spark[] = []
    ;[ slots[1], slots[5], slots[10] ].forEach(slot => {
      slot.occupied = true
      bolts.push({ x: slot.x, y: slot.y, rot: 0, screwDepth: 0, floatOff: Math.random() * Math.PI * 2, done: false, fadeOut: 1, fadeDir: 0 })
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

    // CSS zoom makes clientX/Y use zoomed coords but getBoundingClientRect
    // returns unzoomed values — divide by zoom to reconcile them
    const getZoom = () => parseFloat(document.body.style.zoom || '1') || 1

    const onMouseDown = (e: MouseEvent) => {
      const z = getZoom()
      const r = canvas.getBoundingClientRect()
      const mx = (e.clientX - r.left) / z, my = (e.clientY - r.top) / z
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
      const z = getZoom()
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) / z; mouse.y = (e.clientY - r.top) / z
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
          if (Math.random() < 0.35) {
            const px = bolt.x + (Math.random() - 0.5) * 8
            const py = bolt.y + (Math.random() - 0.5) * 8
            sparks.push({
              x: px,
              y: py,
              vx: (Math.random() - 0.5) * 1.3,
              vy: -0.9 - Math.random() * 0.9,
              life: 1,
              size: 1.2 + Math.random() * 2.1,
            })
            if (sparks.length > 64) sparks.splice(0, sparks.length - 64)
          }
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
      const metal = ctx.createLinearGradient(-42, -8, HEAD_DIST + 14, 8)
      metal.addColorStop(0, '#8AA39A')
      metal.addColorStop(0.45, glow ? '#C4E4D5' : '#B8CABB')
      metal.addColorStop(1, '#547167')
      if (glow) { ctx.shadowColor = '#4A9B7F'; ctx.shadowBlur = 18 }
      ctx.beginPath(); ctx.moveTo(-38, 0); ctx.lineTo(HEAD_DIST, 0)
      ctx.strokeStyle = metal; ctx.lineWidth = 8; ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-38, -1.8); ctx.lineTo(HEAD_DIST - 5, -1.8)
      ctx.strokeStyle = 'rgba(229,245,236,0.42)'; ctx.lineWidth = 1.2; ctx.stroke()

      const ring = ctx.createRadialGradient(HEAD_DIST - 2, -1, 3, HEAD_DIST, 0, 15)
      ring.addColorStop(0, '#D5E8DD')
      ring.addColorStop(1, '#5D7D71')
      ctx.beginPath(); ctx.arc(HEAD_DIST, 0, 13, 0, Math.PI * 2)
      ctx.strokeStyle = ring; ctx.lineWidth = 3.2; ctx.stroke()
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2
        i === 0 ? ctx.moveTo(HEAD_DIST + Math.cos(a)*7, Math.sin(a)*7)
                : ctx.lineTo(HEAD_DIST + Math.cos(a)*7, Math.sin(a)*7)
      }
      ctx.closePath(); ctx.strokeStyle = glow ? '#4A9B7F' : '#8DAE9E'; ctx.lineWidth = 1.6; ctx.stroke()
      ctx.beginPath(); ctx.arc(-38, 0, 9, 0, Math.PI * 2)
      ctx.strokeStyle = '#7E9A90'; ctx.lineWidth = 2.6; ctx.stroke()
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
      const fillGrad = ctx.createRadialGradient(-3, -4, 2, 0, 0, R + 4)
      fillGrad.addColorStop(0, '#DCE8E0')
      fillGrad.addColorStop(1, col)
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6
        i === 0 ? ctx.moveTo(Math.cos(a)*R, Math.sin(a)*R)
                : ctx.lineTo(Math.cos(a)*R, Math.sin(a)*R)
      }
      ctx.closePath()
      ctx.fillStyle = fillGrad; ctx.globalAlpha = 0.42; ctx.fill(); ctx.globalAlpha = 1
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke()
      ctx.strokeStyle = '#2D4F47'; ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(-R*0.55,0); ctx.lineTo(R*0.55,0)
      ctx.moveTo(0,-R*0.55); ctx.lineTo(0,R*0.55)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(231,245,237,0.45)'; ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-R * 0.35, -R * 0.35)
      ctx.lineTo(R * 0.05, -R * 0.55)
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
      for (const s of stars) {
        ctx.fillStyle = `rgba(196,205,184,${s.alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      const tt = t * 0.001

      // Fade done bolts out, fade new bolts in
      for (const bolt of bolts) {
        if (bolt.fadeDir === 1) {
          bolt.fadeOut = Math.min(1, bolt.fadeOut + 0.04)
          if (bolt.fadeOut >= 1) bolt.fadeDir = 0
        }
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
        }
      }

      for (const bolt of bolts) drawBolt(bolt, tt)
      drawWrench(wr.x, wr.y, wr.angle, wr.snapped !== null)

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.02
        s.life -= 0.045
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.globalAlpha = s.life * 0.85
        ctx.fillStyle = '#CDE9DA'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

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
  Strong:      { bg: 'rgba(74,155,127,0.2)',  color: '#4A9B7F',  label: 'Strong'      },
  Comfortable: { bg: 'rgba(157,184,154,0.18)', color: '#9DB89A',  label: 'Comfortable' },
  Learning:    { bg: 'rgba(196,205,184,0.14)', color: '#C4CDB8',  label: 'Learning'    },
}

function SkillTag({ name, tag }: { name: string; tag: string }) {
  const style = tagStyles[tag]
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.58rem 0.8rem',
      borderRadius: '12px',
      marginBottom: '0.55rem',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
      border: '1px solid rgba(157,184,154,0.14)',
      transition: 'all 0.22s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(74,155,127,0.09), rgba(157,184,154,0.05))'
        e.currentTarget.style.borderColor = 'rgba(74,155,127,0.26)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))'
        e.currentTarget.style.borderColor = 'rgba(157,184,154,0.14)'
      }}
    >
      <span style={{ color: '#D2D9CC', fontSize: '0.9rem', fontWeight: 550, letterSpacing: '0.01em' }}>{name}</span>
      <span style={{
        fontSize: '0.7rem', fontWeight: 750,
        padding: '0.2rem 0.62rem',
        borderRadius: '100px',
        background: style.bg,
        color: style.color,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
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
      background: 'linear-gradient(180deg, rgba(36,30,33,0.1), rgba(36,30,33,0.28) 45%, rgba(36,30,33,0.16))',
    }}>
      
      {/* WRENCH & BOLTS BACKGROUND */}
      <WrenchScene />

      {/* CONTENT CONTAINER */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1, // Keeps UI interactive and above the background
      }}>
        <div className="fade-in" style={{
          opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
          marginBottom: '1.5rem',
          padding: '0.6rem 0.9rem',
          width: 'fit-content',
          borderRadius: '999px',
          border: '1px solid rgba(157,184,154,0.25)',
          background: 'rgba(24,20,22,0.52)',
          color: '#B9C9BC',
          fontSize: '0.78rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 650,
        }}>
          Crafting reliable stacks
        </div>

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
          marginBottom: '1rem', color: '#D8DED2',
          lineHeight: 1.15,
        }}>
          What I work with<br />
          <span style={{
            background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>every day.</span>
        </h2>
        <p className="fade-in" style={{
          opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
          margin: '0 0 3rem',
          maxWidth: '640px',
          color: '#AAB6AC',
          lineHeight: 1.7,
          fontSize: '0.98rem',
        }}>
          A focused toolkit for building polished web products and interactive experiences, with room to keep exploring new ideas.
        </p>

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
                     background: 'linear-gradient(180deg, rgba(36,30,33,0.72), rgba(36,30,33,0.54))',
                     backdropFilter: 'blur(10px)',
                     border: `1px solid ${cat.color}2e`,
                     borderRadius: '24px',
                     padding: '1.45rem',
                     boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
                     transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s, background 0.3s',
                  }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${cat.color}7a`
                e.currentTarget.style.boxShadow = `0 16px 45px ${cat.color}26`
                e.currentTarget.style.background = 'linear-gradient(180deg, rgba(36,30,33,0.78), rgba(36,30,33,0.58))'
                e.currentTarget.style.transform = 'translateY(-6px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${cat.color}2e`
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.16)'
                e.currentTarget.style.background = 'linear-gradient(180deg, rgba(36,30,33,0.72), rgba(36,30,33,0.54))'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Card header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                justifyContent: 'space-between',
                marginBottom: '1.3rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                    color: '#D4DBD0', fontWeight: 700, fontSize: '1rem',
                    lineHeight: 1.2,
                  }}>
                    {cat.title}
                  </h3>
                </div>
                <div style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: cat.color,
                  boxShadow: `0 0 14px ${cat.color}88`,
                }}>
                </div>
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
          color: '#AEBCAE', fontSize: '0.9rem',
          letterSpacing: '0.02em',
        }}>
          Building with consistency, learning with curiosity.
        </div>
      </div>
    </section>
  )}