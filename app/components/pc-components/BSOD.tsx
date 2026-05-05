'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { BSODInfo, CRITICALITY_COLOR } from './types'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface BSODProps {
  info: BSODInfo
  onRestart: () => void
  embedded?: boolean
}

export default function BSOD({ info, onRestart, embedded = false }: BSODProps) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [visible, setVisible] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [validScreenshots, setValidScreenshots] = useState<string[]>([])

  const colors = CRITICALITY_COLOR[info.criticality]

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const total = info.project.screenshots.length
    const valid: string[] = new Array(total).fill(null) as string[]
    let checked = 0

    info.project.screenshots.forEach((src, idx) => {
      const img = new window.Image()
      img.onload = () => {
        valid[idx] = src
        checked++
        if (checked === total) {
          setValidScreenshots(valid.filter(Boolean))
          setGalleryIndex(0)
        }
      }
      img.onerror = () => {
        checked++
        if (checked === total) {
          setValidScreenshots(valid.filter(Boolean))
          setGalleryIndex(0)
        }
      }
      img.src = src
    })
  }, [info])

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
    const speed = info.criticality === 'CRITICAL' ? 25 : info.criticality === 'HIGH' ? 35 : info.criticality === 'MEDIUM' ? 50 : 65
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); setDone(true); return 100 } return p + 1.2 })
    }, speed)
    return () => clearInterval(interval)
  }, [info.criticality])

  const nav = (dir: number) => {
    setGalleryIndex(i => (i + dir + validScreenshots.length) % validScreenshots.length)
  }

  const font = embedded
    ? { sad: '4rem', body: '0.85rem', progress: '0.85rem', detail: '0.65rem', cardTitle: '0.85rem', cardBody: '0.65rem', btn: '0.65rem' }
    : { sad: '9rem', body: '1.6rem', progress: '1.6rem', detail: '1rem', cardTitle: '1.2rem', cardBody: '0.9rem', btn: '1rem' }

  // 1. The main BSOD Screen Content
  const content = (
    <div style={{
      position: embedded ? 'absolute' : 'fixed',
      inset: 0,
      zIndex: embedded ? 8 : 99999,
      background: colors.bg,
      display: 'block', 
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.08s',
      padding: embedded ? '24px 32px' : '5rem 8rem',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <div style={{ position: embedded ? 'absolute' : 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)`, zIndex: 1 }}/>

      <div style={{ maxWidth: embedded ? '100%' : 900, width: '100%', color: colors.accent, position: 'relative', zIndex: 2 }}>
        
        <div style={{ fontSize: font.sad, marginBottom: embedded ? '1rem' : '2rem', lineHeight: 1, fontWeight: 300 }}>
          :(
        </div>

        <div style={{ fontSize: font.body, fontWeight: 300, marginBottom: embedded ? '1rem' : '2.5rem', lineHeight: 1.4 }}>
          Your PC ran into a problem and needs to restart. We're just<br/>
          collecting some error info, and then we'll restart for you.
        </div>

        <div style={{ fontSize: font.progress, fontWeight: 300, marginBottom: embedded ? '1.5rem' : '3rem' }}>
          {Math.round(progress)}% complete
        </div>

        <div style={{ display: 'flex', gap: embedded ? 16 : 32, marginBottom: embedded ? '2rem' : '4rem', alignItems: 'flex-start' }}>
          <div style={{ width: embedded ? 64 : 110, height: embedded ? 64 : 110, background: colors.accent, padding: embedded ? 4 : 8, flexShrink: 0 }}>
            <div style={{ width: '100%', height: '100%', background: colors.bg, backgroundImage: `repeating-linear-gradient(45deg, transparent 0, transparent 4px, ${colors.accent} 4px, ${colors.accent} 8px), repeating-linear-gradient(-45deg, transparent 0, transparent 4px, ${colors.accent} 4px, ${colors.accent} 8px)` }}/>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: font.detail, lineHeight: 1.5, opacity: 0.9 }}>
            <div>For more information about this issue and possible fixes, visit</div>
            <div><strong>https://www.windows.com/stopcode</strong></div>
            <div style={{ marginTop: embedded ? '0.5rem' : '1rem' }}>If you call a support person, give them this info:</div>
            <div>Stop code: <strong>{info.message}</strong></div>
            <div>Failed component: <strong>{info.component}</strong></div>
          </div>
        </div>

        <div style={{ background: `${colors.accent}11`, border: `1px solid ${colors.accent}33`, borderRadius: 8, padding: embedded ? '1rem' : '1.5rem', marginBottom: embedded ? '1rem' : '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.8rem' }}>
            <div style={{ padding: '2px 8px', background: colors.accent, color: colors.bg, fontSize: embedded ? '0.5rem' : '0.65rem', fontWeight: 800, letterSpacing: '0.1em', borderRadius: 2 }}>
              RECOVERY PAYLOAD
            </div>
            <div style={{ fontSize: embedded ? '0.55rem' : '0.7rem', opacity: 0.7, fontFamily: 'monospace' }}>PROJECT FOUND ON REMOVED COMPONENT</div>
          </div>

          <div style={{ display: 'flex', gap: embedded ? '1rem' : '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: embedded ? 0 : 250 }}>
              <div style={{ fontSize: font.cardTitle, fontWeight: 700, marginBottom: '0.4rem' }}>{info.project.title}</div>
              <div style={{ fontSize: font.cardBody, opacity: 0.8, lineHeight: 1.6, marginBottom: '1rem' }}>{info.project.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {info.project.tech.map(t => (
                  <span key={t} style={{ padding: '2px 8px', borderRadius: 4, fontSize: embedded ? '0.55rem' : '0.7rem', background: `${colors.accent}22`, border: `1px solid ${colors.accent}44`, fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ width: embedded ? '100%' : 220, flexShrink: 0 }}>
              <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: `1px solid ${colors.accent}44`, background: '#000', cursor: 'pointer', height: embedded ? 90 : 130 }} onClick={() => setShowGallery(true)}>
                <img src={validScreenshots[0] || info.project.screenshots[0]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}/>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: embedded ? '0.6rem' : '0.8rem', fontWeight: 600, opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>View Gallery</div>
              </div>
            </div>
          </div>
        </div>

        {done && (
          <button onClick={onRestart} style={{ display: 'inline-block', background: 'transparent', border: `2px solid ${colors.accent}`, color: colors.accent, padding: embedded ? '0.6rem 1.2rem' : '1rem 2rem', fontSize: font.btn, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = colors.accent; e.currentTarget.style.color = colors.bg }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.accent }}>
            Restart PC — Reinsert {info.component}
          </button>
        )}
      </div>
      <style>{`@keyframes imgPop { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )

  if (!mounted) return null

  // 2. The Lightbox Gallery - Portaled directly to the body to escape the monitor screen
  const galleryLightbox = showGallery ? createPortal(
    <div onClick={() => setShowGallery(false)} style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 900, width: '100%' }}>
        <img key={galleryIndex} src={validScreenshots[galleryIndex] || info.project.screenshots[galleryIndex]} alt="screenshot" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', maxHeight: '85vh', borderRadius: 8, border: `1px solid ${colors.accent}44`, animation: 'imgPop 0.15s ease' }}/>
        <button onClick={() => setShowGallery(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.8)', border: `1px solid ${colors.accent}66`, borderRadius: '50%', color: '#fff', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={20}/>
        </button>
        {validScreenshots.length > 1 && <>
          <button onClick={() => nav(-1)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.8)', border: `1px solid ${colors.accent}66`, borderRadius: '50%', color: '#fff', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={24}/></button>
          <button onClick={() => nav(1)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.8)', border: `1px solid ${colors.accent}66`, borderRadius: '50%', color: '#fff', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={24}/></button>
        </>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          {validScreenshots.map((_, i) => (
            <div key={i} onClick={() => setGalleryIndex(i)} style={{ width: i === galleryIndex ? 24 : 8, height: 8, borderRadius: 100, background: i === galleryIndex ? colors.accent : '#555', transition: 'all 0.2s', cursor: 'pointer' }}/>
          ))}
        </div>
      </div>
    </div>,
    document.body
  ) : null

  // 3. Render logic
  if (embedded) {
    return (
      <>
        {content}
        {galleryLightbox}
      </>
    )
  }

  return (
    <>
      {createPortal(content, document.body)}
      {galleryLightbox}
    </>
  )
}