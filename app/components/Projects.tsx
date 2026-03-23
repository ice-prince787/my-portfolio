'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { BSOD_MAP, BSODInfo } from './pc-components/types'
import DraggableComponent from './pc-components/DraggableComponent'
import BSOD from './pc-components/BSOD'
import Motherboard from './pc-components/Motherboard'
import GPU from './pc-components/GPU'
import RAM from './pc-components/RAM'
import CPU from './pc-components/CPU'
import CPUCooler from './pc-components/CPUCooler'
import SSD from './pc-components/SSD'
import PSU from './pc-components/PSU'
import Window from './pc-components/Window'

const COMPONENTS = ['gpu', 'ram1', 'ram2', 'cpu', 'cooler', 'ssd', 'psu'] as const
type ComponentId = typeof COMPONENTS[number]

// Map each component id to its BSOD key
const BSOD_KEY: Record<ComponentId, string> = {
  gpu: 'gpu', ram1: 'ram', ram2: 'ram2', cpu: 'cpu',
  cooler: 'cooler', ssd: 'ssd', psu: 'psu',
}

const LABELS: Record<ComponentId, string> = {
  gpu: 'GPU', ram1: 'RAM #1', ram2: 'RAM #2', cpu: 'CPU',
  cooler: 'CPU Cooler', ssd: 'SSD', psu: 'PSU',
}

const SLOTS: Record<ComponentId, React.CSSProperties> = {
  cpu:    { left: 30,  top: 60,  width: 90,  height: 90 },
  cooler: { left: 15,  top: 45,  width: 120, height: 120 },
  ram1:   { left: 188, top: 60,  width: 28,  height: 130 },
  ram2:   { left: 226, top: 60,  width: 28,  height: 130 },
  gpu:    { left: 30,  top: 232, width: 220, height: 80 },
  ssd:    { left: 30,  top: 322, width: 160, height: 32 },
  psu:    { left: 390, top: 360, width: 130, height: 70 },
}

type RemovedState = Record<ComponentId, boolean>
const INITIAL: RemovedState = { gpu: false, ram1: false, ram2: false, cpu: false, cooler: false, ssd: false, psu: false }

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [removed, setRemoved] = useState<RemovedState>(INITIAL)
  const [bsod, setBsod] = useState<BSODInfo | null>(null)
  const [bootAnim, setBootAnim] = useState(false)

  // Preload ALL project screenshots the moment this section mounts
  // so they're fully cached before anyone even touches a component
  useEffect(() => {
    Object.values(BSOD_MAP).forEach(bsod => {
      bsod.project.screenshots.forEach(src => {
        const img = new window.Image()
        img.src = src
      })
    })
  }, [])

  const handleRemove = useCallback((id: string) => {
    const cid = id as ComponentId
    setRemoved(prev => ({ ...prev, [cid]: true }))
    setTimeout(() => setBsod(BSOD_MAP[BSOD_KEY[cid]]), 220)
  }, [])

  const handleRestart = () => {
    setBsod(null)
    setBootAnim(true)
    setRemoved(INITIAL)
    setTimeout(() => setBootAnim(false), 1800)
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
            setTimeout(() => {
              (el as HTMLElement).style.opacity = '1'
              ;(el as HTMLElement).style.transform = 'translateY(0)'
            }, i * 120)
          })
        }
      })
    }, { threshold: 0.05 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const anyRemoved = Object.values(removed).some(Boolean)

  return (
    <section id="projects" ref={sectionRef} style={{
      padding: '6rem 2rem', position: 'relative', overflow: 'hidden',
      minHeight: '100vh',
      background: '#0b0f12',
    }}>
      {/* Full cozy tech-room scene */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Back wall */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #21272d 0%, #1a2026 44%, #141a20 64%, #12171c 100%)',
        }} />

        {/* Subtle wall texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 9px)',
        }} />

        <Window />

        {/* Window cast glow on wall */}
        <div style={{
          position: 'absolute',
          right: '7.5%',
          top: '14%',
          width: 420,
          height: 280,
          borderRadius: 24,
          background: 'radial-gradient(ellipse at 70% 35%, rgba(133,164,220,0.2) 0%, rgba(82,114,170,0.09) 36%, rgba(72,102,152,0) 72%)',
          filter: 'blur(6px)',
          animation: 'roomBreathe 8s ease-in-out infinite',
        }} />

        {/* Warm side lamp */}
        <div style={{
          position: 'absolute',
          left: '11%',
          top: '22%',
          width: 18,
          height: 66,
          borderRadius: 10,
          background: '#3f3a35',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute',
          left: '9.8%',
          top: '19%',
          width: 42,
          height: 32,
          borderRadius: '18px 18px 10px 10px',
          background: '#4c433b',
          border: '1px solid rgba(255,255,255,0.12)',
        }} />
        {/* Warm side lamp glow */}
        <div style={{
          position: 'absolute',
          left: '11%',
          top: '20%',
          width: 190,
          height: 190,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,204,136,0.32) 0%, rgba(255,171,102,0.16) 42%, rgba(255,154,92,0) 76%)',
          filter: 'blur(3px)',
          animation: 'lampFlicker 5.4s ease-in-out infinite',
        }} />

        {/* Realistic ambient bounce on desk */}
        <div style={{
          position: 'absolute',
          left: '12%',
          right: '12%',
          bottom: '7.6%',
          height: 12,
          borderRadius: 999,
          background: 'radial-gradient(ellipse at 36% 50%, rgba(255,185,118,0.2) 0%, rgba(255,185,118,0) 36%), radial-gradient(ellipse at 78% 50%, rgba(132,174,230,0.18) 0%, rgba(132,174,230,0) 36%)',
          filter: 'blur(2px)',
          animation: 'roomBreathe 8s ease-in-out infinite',
        }} />

        {/* Floor */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '26%',
          background: 'linear-gradient(180deg, #3a3028 0%, #30271f 100%)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }} />
      </div>

      {bsod && <BSOD info={bsod} onRestart={handleRestart} />}

      {bootAnim && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 8000, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'bootFade 1.8s ease forwards' }}>
          <div style={{ color: '#4A9B7F', fontFamily: 'monospace', fontSize: '1rem', marginBottom: '1rem' }}>ASUS ROG BIOS — System Restart...</div>
          <div style={{ color: '#9DB89A', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.4rem' }}>✓ CPU detected — Intel i9-13900K</div>
          <div style={{ color: '#9DB89A', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.4rem' }}>✓ RAM detected — 32GB DDR5</div>
          <div style={{ color: '#9DB89A', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.4rem' }}>✓ GPU detected — RTX 4090</div>
          <div style={{ color: '#9DB89A', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7 }}>✓ Boot device found — Samsung 990 Pro</div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.7s ease', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #4A9B7F, #9DB89A)' }} />
            <span style={{ color: '#9DB89A', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Interactive</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#C4CDB8', margin: 0, marginBottom: '0.5rem' }}>
            My <span style={{ background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PC Build.(Projects)</span>
          </h2>
          <p style={{ color: '#9DB89A', fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>
            🖱 Drag any component out of the case to pull it — each one has a project inside.
          </p>
        </div>

        {/* PC Case */}
        <div className="fade-up" style={{ opacity: 0, transform: 'translateY(40px)', transition: 'all 0.8s ease 0.2s', display: 'inline-block', position: 'relative' }}>
          {/* Floor contact shadow so PC feels grounded */}
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: -24,
            width: '85%',
            height: 42,
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.16) 55%, rgba(0,0,0,0) 100%)',
            filter: 'blur(2px)',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Outer case shell */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(145deg, #1c1c1c 0%, #252525 40%, #1c1c1c 100%)',
            border: '2px solid #2a2a2a',
            borderRadius: 18, padding: 22,
            boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 60px rgba(74,155,127,0.04)',
          }}>

            {/* Top bar with status LED */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 22, background: '#111', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', paddingLeft: 16, gap: 10 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: anyRemoved ? '#ff3333' : '#4AFF7F',
                boxShadow: anyRemoved ? '0 0 8px #ff3333' : '0 0 8px #4AFF7F',
                transition: 'all 0.3s',
              }}/>
              <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: anyRemoved ? '#ff8888' : '#555', transition: 'color 0.3s' }}>
                {anyRemoved ? '⚠ HARDWARE FAULT DETECTED' : 'ALL SYSTEMS NOMINAL'}
              </span>
              {/* Right side case branding */}
              <span style={{ position: 'absolute', right: 16, fontFamily: 'monospace', fontSize: '0.55rem', color: '#333' }}>
                ROG CASE ·  TG SIDE PANEL
              </span>
            </div>

            {/* Tempered glass glare */}
            <div style={{ position: 'absolute', inset: 22, background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, pointerEvents: 'none', zIndex: 200 }}/>

            {/* Interior */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(160deg, #132019 0%, #101813 48%, #0d130f 100%)',
              borderRadius: 8, padding: '30px 16px 16px', overflow: 'visible',
              boxShadow: 'inset 0 0 48px rgba(0,0,0,0.52), inset 0 0 80px rgba(74,155,127,0.06)',
            }}>
              {/* RGB strip top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #ff0080, #4A9B7F, #0080ff, #ff8000, #ff00ff, #ff0080)', borderRadius: '8px 8px 0 0', animation: 'rgbMove 4s linear infinite' }}/>
              {/* RGB strip bottom */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #0080ff, #ff0080, #4A9B7F, #ff8000)', borderRadius: '0 0 8px 8px', opacity: 0.5, animation: 'rgbMove 6s linear infinite reverse' }}/>

              {/* Motherboard + all components */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* Cozy CPU backlight zone */}
                <div style={{
                  position: 'absolute',
                  left: 22,
                  top: 54,
                  width: 108,
                  height: 108,
                  borderRadius: 20,
                  background: 'radial-gradient(circle at 35% 35%, rgba(255,210,150,0.22) 0%, rgba(255,170,92,0.1) 35%, rgba(74,155,127,0.1) 62%, rgba(0,0,0,0) 100%)',
                  filter: 'blur(1.5px)',
                  boxShadow: '0 0 32px rgba(255,170,92,0.2), 0 0 52px rgba(74,155,127,0.12)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute',
                  left: 36,
                  top: 68,
                  width: 80,
                  height: 80,
                  borderRadius: 14,
                  border: '1px solid rgba(255,220,170,0.22)',
                  background: 'linear-gradient(145deg, rgba(255,188,120,0.12), rgba(74,155,127,0.08))',
                  boxShadow: 'inset 0 0 18px rgba(255,220,170,0.1)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }} />

                <Motherboard />

                <DraggableComponent id="cpu" slotStyle={SLOTS.cpu} onRemove={handleRemove} removed={removed.cpu} label={LABELS.cpu}>
                  <CPU />
                </DraggableComponent>
                <DraggableComponent id="cooler" slotStyle={SLOTS.cooler} onRemove={handleRemove} removed={removed.cooler} label={LABELS.cooler}>
                  <CPUCooler />
                </DraggableComponent>
                <DraggableComponent id="ram1" slotStyle={SLOTS.ram1} onRemove={handleRemove} removed={removed.ram1} label={LABELS.ram1}>
                  <RAM slot={0} />
                </DraggableComponent>
                <DraggableComponent id="ram2" slotStyle={SLOTS.ram2} onRemove={handleRemove} removed={removed.ram2} label={LABELS.ram2}>
                  <RAM slot={1} />
                </DraggableComponent>
                <DraggableComponent id="gpu" slotStyle={SLOTS.gpu} onRemove={handleRemove} removed={removed.gpu} label={LABELS.gpu}>
                  <GPU />
                </DraggableComponent>
                <DraggableComponent id="ssd" slotStyle={SLOTS.ssd} onRemove={handleRemove} removed={removed.ssd} label={LABELS.ssd}>
                  <SSD />
                </DraggableComponent>
                <DraggableComponent id="psu" slotStyle={SLOTS.psu} onRemove={handleRemove} removed={removed.psu} label={LABELS.psu}>
                  <PSU />
                </DraggableComponent>
              </div>
            </div>
          </div>

          {/* Component status pills */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {COMPONENTS.map(id => (
              <div key={id} style={{
                padding: '4px 12px', borderRadius: 100,
                background: removed[id] ? 'rgba(255,60,60,0.12)' : 'rgba(74,155,127,0.08)',
                border: `1px solid ${removed[id] ? 'rgba(255,60,60,0.35)' : 'rgba(74,155,127,0.25)'}`,
                fontSize: '0.7rem', fontWeight: 600,
                color: removed[id] ? '#ff9999' : '#9DB89A',
                transition: 'all 0.3s', fontFamily: 'monospace',
              }}>
                {removed[id] ? '✗' : '✓'} {LABELS[id]}
              </div>
            ))}
          </div>

          {anyRemoved && !bsod && (
            <div style={{ marginTop: '0.8rem', textAlign: 'center', color: '#ff8888', fontSize: '0.75rem', fontFamily: 'monospace', animation: 'blink 0.8s ease infinite' }}>
              ⚠ HARDWARE FAULT — drag component further to trigger BSOD
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes bootFade { 0%{opacity:1} 70%{opacity:1} 100%{opacity:0;pointer-events:none} }
        @keyframes rgbMove { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
        @keyframes roomBreathe {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes lampFlicker {
          0%, 100% { opacity: 0.92; }
          35% { opacity: 1; }
          38% { opacity: 0.84; }
          41% { opacity: 0.98; }
          70% { opacity: 0.9; }
        }
      `}</style>
    </section>
  )
}