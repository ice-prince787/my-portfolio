'use client'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { BSODInfo, CRITICALITY_COLOR } from './types'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface BSODProps {
  info: BSODInfo
  onRestart: () => void
}

export default function BSOD({ info, onRestart }: BSODProps) {
  const [dots, setDots] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [visible, setVisible] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [mounted, setMounted] = useState(false)

  const colors = CRITICALITY_COLOR[info.criticality]

  useEffect(() => { setMounted(true) }, [])

  const [validScreenshots, setValidScreenshots] = useState<string[]>([])

  useEffect(() => {
    // Preload all screenshots immediately — images are cached by browser
    // so by the time user opens gallery they load instantly
    const total = info.project.screenshots.length
    const valid: string[] = new Array(total).fill(null) as string[]
    let checked = 0

    info.project.screenshots.forEach((src, idx) => {
      const img = new window.Image()
      img.onload = () => {
        valid[idx] = src   // preserve order
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
      img.src = src  // starts downloading immediately
    })
  }, [info])

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
    const speed = info.criticality === 'CRITICAL' ? 25 : info.criticality === 'HIGH' ? 35 : info.criticality === 'MEDIUM' ? 50 : 65
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); setDone(true); return 100 } return p + 1.2 })
    }, speed)
    const dotInterval = setInterval(() => setDots(d => (d + 1) % 4), 500)
    return () => { clearInterval(interval); clearInterval(dotInterval) }
  }, [])

  const nav = (dir: number) => {
    setGalleryIndex(i => (i + dir + validScreenshots.length) % validScreenshots.length)
  }

  const content = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: colors.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.08s',
      padding: '2rem',
      overflow: 'auto',
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)`, zIndex: 1 }}/>

      <div style={{ maxWidth: 680, width: '100%', color: colors.accent, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${colors.accent}22`, border: `1px solid ${colors.accent}66`, borderRadius: 100, padding: '4px 14px', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent, boxShadow: `0 0 6px ${colors.accent}` }}/>
          {info.criticality} SEVERITY — {info.component} REMOVED
        </div>

        <div style={{ fontSize: '5rem', marginBottom: '1rem', lineHeight: 1 }}>:(</div>

        <div style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: '1.5rem', lineHeight: 1.6, color: '#ccc' }}>
          Your PC ran into a problem and needs to restart.
          <br /><span style={{ opacity: 0.7 }}>We're collecting error info, then we'll restart for you.</span>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 300, color: colors.accent, marginBottom: '0.5rem' }}>
            {Math.round(progress)}% complete{'.'.repeat(dots)}
          </div>
          <div style={{ height: 4, background: `${colors.accent}22`, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: colors.accent, borderRadius: 2, transition: 'width 0.1s linear', boxShadow: `0 0 8px ${colors.accent}` }}/>
          </div>
        </div>

        <div style={{ background: `${colors.accent}11`, borderRadius: 8, padding: '1rem 1.2rem', marginBottom: '1.5rem', borderLeft: `3px solid ${colors.accent}` }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '0.3rem', fontFamily: 'monospace', color: colors.accent }}>STOP CODE</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', marginBottom: '0.6rem', color: colors.accent }}>{info.message}</div>
          <div style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6 }}>{info.detail}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.6rem', fontFamily: 'monospace', color: colors.accent }}>{info.code} — {info.component}</div>
        </div>

        {/* Project card */}
        <div style={{ background: `${colors.accent}0d`, border: `1px solid ${colors.accent}33`, borderRadius: 12, padding: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: colors.accent, opacity: 0.6, marginBottom: '0.4rem', letterSpacing: '0.1em' }}>RELATED PROJECT FOUND ON REMOVED COMPONENT</div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ddd', marginBottom: '0.4rem' }}>{info.project.title}</div>
              <div style={{ fontSize: '0.82rem', color: '#999', lineHeight: 1.6, marginBottom: '0.8rem' }}>{info.project.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {info.project.tech.map(t => (
                  <span key={t} style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', background: `${colors.accent}18`, color: colors.accent, border: `1px solid ${colors.accent}33`, fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ width: 200, flexShrink: 0 }}>
              <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `1px solid ${colors.accent}44`, background: '#111', cursor: 'pointer', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowGallery(true)}>
                <img src={validScreenshots[0] || info.project.screenshots[0]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}/>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: colors.accent, fontWeight: 600, opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>View Screenshots</div>
              </div>
              <button onClick={() => setShowGallery(true)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', background: `${colors.accent}18`, border: `1px solid ${colors.accent}44`, borderRadius: 6, color: colors.accent, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = `${colors.accent}33`} onMouseLeave={e => e.currentTarget.style.background = `${colors.accent}18`}>
                📸 View Screenshots
              </button>
            </div>
          </div>
        </div>

        {done && (
          <button onClick={onRestart} style={{ background: `${colors.accent}22`, border: `2px solid ${colors.accent}99`, borderRadius: 8, color: colors.accent, padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 0 20px ${colors.accent}33` }} onMouseEnter={e => { e.currentTarget.style.background = `${colors.accent}44` }} onMouseLeave={e => { e.currentTarget.style.background = `${colors.accent}22` }}>
            🔄 Restart PC — put {info.component} back
          </button>
        )}
      </div>

      {/* Screenshot lightbox */}
      {showGallery && (
        <div onClick={() => setShowGallery(false)} style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 860, width: '100%' }}>
            <img key={galleryIndex} src={validScreenshots[galleryIndex] || info.project.screenshots[galleryIndex]} alt="screenshot" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', maxHeight: '80vh', borderRadius: 16, border: `1px solid ${colors.accent}44`, animation: 'imgPop 0.15s ease' }}/>
            <button onClick={() => setShowGallery(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.8)', border: `1px solid ${colors.accent}66`, borderRadius: '50%', color: '#ccc', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16}/>
            </button>
            {validScreenshots.length > 1 && <>
              <button onClick={() => nav(-1)} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.7)', border: `1px solid ${colors.accent}55`, borderRadius: '50%', color: '#ccc', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={18}/></button>
              <button onClick={() => nav(1)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.7)', border: `1px solid ${colors.accent}55`, borderRadius: '50%', color: '#ccc', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={18}/></button>
            </>}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
              {validScreenshots.map((_, i) => (
                <div key={i} onClick={() => setGalleryIndex(i)} style={{ width: i === galleryIndex ? 20 : 7, height: 7, borderRadius: 100, background: i === galleryIndex ? colors.accent : '#444', transition: 'all 0.2s', cursor: 'pointer' }}/>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes imgPop { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )

  // Render via portal to document.body so it escapes the scale transform
  if (!mounted) return null
  return createPortal(content, document.body)
}