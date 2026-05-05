'use client'

import { useEffect, useMemo, useState } from 'react'

type AppId = 'command' | 'logs' | 'map' | 'snake'
type Dir = 'up' | 'down' | 'left' | 'right'

interface MonitorProps {
  children: React.ReactNode
}

const GRID_SIZE = 14

export default function Monitor({ children }: MonitorProps) {
  const chamfer = 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)'

  return (
    <div style={{ width: 'clamp(420px, 42vw, 760px)', flexShrink: 0, position: 'relative', zIndex: 3 }}>
      <div style={{ height: 10, margin: '0 8% 3px', background: 'linear-gradient(180deg, #5c6673 0%, #2f3640 100%)', clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0 100%)' }} />

      <div style={{
        position: 'relative',
        padding: 14,
        clipPath: chamfer,
        border: '1px solid rgba(185,206,228,0.22)',
        background: 'linear-gradient(148deg, rgba(153,170,188,0.25) 0%, transparent 34%), linear-gradient(180deg, #2f3945 0%, #1a1f26 62%, #12161c 100%)',
        boxShadow: '0 32px 65px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.14)',
      }}>
        <div style={{
          position: 'relative',
          padding: 8,
          clipPath: chamfer,
          border: '1px solid rgba(0,0,0,0.75)',
          background: 'linear-gradient(180deg, #0e1217 0%, #090b10 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(109,155,193,0.18)',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            border: '1px solid rgba(195,223,255,0.14)',
            clipPath: 'polygon(9px 0, calc(100% - 9px) 0, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0 calc(100% - 9px), 0 9px)',
            background: '#02060a',
            boxShadow: 'inset 0 0 0 1px rgba(123,183,230,0.2), inset 0 0 54px rgba(71,124,168,0.16)',
          }}>
            {children}
          </div>

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: '0.54rem', color: 'rgba(214,231,248,0.45)', letterSpacing: '0.08em' }}>
            <span>XR-77 TACTICAL DISPLAY // OUTER RIM</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, background: '#7dd3ff', boxShadow: '0 0 8px #7dd3ff' }} />
              LINK
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -2 }}>
        <div style={{ width: 'clamp(110px, 24%, 170px)', height: 30, background: 'linear-gradient(180deg, #2d333c 0%, #171b22 100%)', clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }} />
        <div style={{ width: 'clamp(220px, 46%, 380px)', height: 10, marginTop: -1, border: '1px solid rgba(184,213,237,0.12)', background: 'linear-gradient(90deg, #1a1d22 0%, #333c49 50%, #1a1d22 100%)' }} />
      </div>
    </div>
  )
}

export function MonitorDesktop() {
  const [startOpen, setStartOpen] = useState(false)
  const [openApps, setOpenApps] = useState<AppId[]>(['command'])
  const [active, setActive] = useState<AppId>('command')
  const [logs, setLogs] = useState('00:14 // Hyperdrive nominal\n00:18 // Shield matrix synced\n00:27 // Sensor ping: unknown object')
  const [dir, setDir] = useState<Dir>('right')
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }])
  const [food, setFood] = useState({ x: 10, y: 6 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const now = new Date()
  const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const open = (id: AppId) => {
    setStartOpen(false)
    setOpenApps(prev => (prev.includes(id) ? prev : [...prev, id]))
    setActive(id)
  }

  const close = (id: AppId) => {
    setOpenApps(prev => prev.filter(v => v !== id))
    if (active === id) {
      const remaining = openApps.filter(v => v !== id)
      setActive(remaining[remaining.length - 1] ?? 'command')
    }
  }

  const resetSnake = () => {
    setSnake([{ x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }])
    setFood({ x: 10, y: 6 })
    setDir('right')
    setScore(0)
    setGameOver(false)
  }

  useEffect(() => {
    if (active !== 'snake' || gameOver) return
    const timer = setInterval(() => {
      setSnake(prev => {
        const head = prev[0]
        const next = { ...head }
        if (dir === 'up') next.y -= 1
        if (dir === 'down') next.y += 1
        if (dir === 'left') next.x -= 1
        if (dir === 'right') next.x += 1

        if (next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE || prev.some(p => p.x === next.x && p.y === next.y)) {
          setGameOver(true)
          return prev
        }

        const grown = [next, ...prev]
        if (next.x === food.x && next.y === food.y) {
          setScore(s => s + 1)
          setFood(() => {
            let candidate = { x: 0, y: 0 }
            let tries = 0
            do {
              candidate = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
              tries++
            } while (grown.some(p => p.x === candidate.x && p.y === candidate.y) && tries < 100)
            return candidate
          })
          return grown
        }
        grown.pop()
        return grown
      })
    }, 150)
    return () => clearInterval(timer)
  }, [active, dir, food, gameOver])

  const turn = (next: Dir) => {
    setDir(prev => {
      if ((prev === 'up' && next === 'down') || (prev === 'down' && next === 'up') || (prev === 'left' && next === 'right') || (prev === 'right' && next === 'left')) {
        return prev
      }
      return next
    })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active !== 'snake') return
      if (e.key === 'ArrowUp') turn('up')
      if (e.key === 'ArrowDown') turn('down')
      if (e.key === 'ArrowLeft') turn('left')
      if (e.key === 'ArrowRight') turn('right')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const apps = useMemo(() => ([
    { id: 'command' as const, label: 'Command' },
    { id: 'logs' as const, label: 'Logbook' },
    { id: 'map' as const, label: 'Star Map' },
    { id: 'snake' as const, label: 'Snake' },
  ]), [])

  return (
    <div onClick={() => setStartOpen(false)} style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at 22% 12%, #1d2d3b 0%, #0b1118 38%, #070b11 100%)',
      color: '#d8e5f2',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: 'repeating-linear-gradient(0deg, rgba(120,170,210,0.08) 0 1px, transparent 1px 18px), repeating-linear-gradient(90deg, rgba(120,170,210,0.08) 0 1px, transparent 1px 18px)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: '1px solid rgba(146,196,236,0.25)', background: 'linear-gradient(180deg, rgba(16,27,40,0.96), rgba(8,14,22,0.95))', fontFamily: 'monospace', fontSize: '0.56rem', letterSpacing: '0.09em' }}>
        <span>COMMAND DECK // SECTOR 7</span>
        <span style={{ color: '#8bc7ff' }}>NET-LINK ACTIVE</span>
      </div>

      <div style={{ position: 'absolute', inset: '38px 10px 44px', display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', alignContent: 'start', gap: 8 }}>
        {apps.map(app => (
          <button key={app.id} type="button" onClick={(e) => { e.stopPropagation(); open(app.id) }} style={{ border: 0, background: 'transparent', color: '#ecf5ff', fontSize: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <span style={{ width: 20, height: 20, borderRadius: 3, background: 'linear-gradient(145deg, #8eb6d4, #47637b)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)' }} />
            {app.label}
          </button>
        ))}
      </div>

      {openApps.includes('command') && active === 'command' && (
        <DesktopWindow title="Bridge Status" onClose={() => close('command')}>
          <div style={{ fontSize: '0.62rem', lineHeight: 1.5, color: '#d9eaff' }}>
            <div><strong>Vessel: ROG-Interceptor</strong></div>
            <div>Core: Intel i9-13900K</div>
            <div>Memory Matrix: 32GB DDR5</div>
            <div>Render Engine: RTX 4090</div>
            <div style={{ marginTop: 6, opacity: 0.85 }}>Extracting any component triggers emergency diagnostics feed.</div>
          </div>
        </DesktopWindow>
      )}

      {openApps.includes('logs') && active === 'logs' && (
        <DesktopWindow title="Captain Logbook" onClose={() => close('logs')}>
          <textarea value={logs} onChange={(e) => setLogs(e.target.value)} style={{ width: '100%', height: 130, resize: 'none', border: '1px solid rgba(153,203,242,0.3)', borderRadius: 4, background: 'rgba(4,10,18,0.65)', color: '#dbeeff', padding: 8, fontFamily: 'monospace', fontSize: '0.6rem' }} />
        </DesktopWindow>
      )}

      {openApps.includes('map') && active === 'map' && (
        <DesktopWindow title="Star Map" onClose={() => close('map')}>
          <div style={{ position: 'relative', height: 134, border: '1px solid rgba(142,198,242,0.26)', borderRadius: 4, background: 'radial-gradient(circle at 30% 30%, rgba(69,130,183,0.28), rgba(6,12,20,0.72))' }}>
            {[...Array(24)].map((_, i) => (
              <span key={i} style={{ position: 'absolute', left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#9ad2ff', opacity: i % 4 === 0 ? 0.9 : 0.55 }} />
            ))}
          </div>
        </DesktopWindow>
      )}

      {openApps.includes('snake') && active === 'snake' && (
        <DesktopWindow title="Snake // Training Sim" onClose={() => close('snake')}>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', fontFamily: 'monospace' }}>
              <span>Score: {score}</span>
              <span>{gameOver ? 'SYSTEM FAIL' : 'ONLINE'}</span>
            </div>
            <div style={{ width: 196, height: 196, display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: 1, border: '1px solid rgba(145,198,236,0.32)', background: 'rgba(3,8,14,0.9)', padding: 4 }}>
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                const x = idx % GRID_SIZE
                const y = Math.floor(idx / GRID_SIZE)
                const isHead = snake[0]?.x === x && snake[0]?.y === y
                const isBody = snake.slice(1).some(s => s.x === x && s.y === y)
                const isFood = food.x === x && food.y === y
                let bg = 'rgba(95,136,168,0.08)'
                if (isBody) bg = 'rgba(104,188,255,0.5)'
                if (isHead) bg = '#9de2ff'
                if (isFood) bg = '#ffd27a'
                return <div key={idx} style={{ background: bg, borderRadius: 1 }} />
              })}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Control label="Up" onClick={() => turn('up')} />
              <Control label="Left" onClick={() => turn('left')} />
              <Control label="Right" onClick={() => turn('right')} />
              <Control label="Down" onClick={() => turn('down')} />
              <Control label="Reset" onClick={resetSnake} />
            </div>
            <div style={{ fontSize: '0.52rem', opacity: 0.75 }}>Use arrow keys or control buttons.</div>
          </div>
        </DesktopWindow>
      )}

      <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, borderTop: '1px solid rgba(146,196,236,0.25)', background: 'linear-gradient(180deg, rgba(8,14,24,0.75), rgba(5,9,14,0.96))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button type="button" onClick={() => setStartOpen(v => !v)} style={{ padding: '4px 8px', fontSize: '0.56rem', borderRadius: 4, border: '1px solid rgba(146,196,236,0.3)', background: startOpen ? 'rgba(87,145,196,0.45)' : 'rgba(255,255,255,0.08)', color: '#e7f3ff', cursor: 'pointer' }}>Menu</button>
          {openApps.map(id => (
            <button key={id} type="button" onClick={() => setActive(id)} style={{ padding: '3px 7px', fontSize: '0.54rem', borderRadius: 4, border: '1px solid rgba(146,196,236,0.24)', background: active === id ? 'rgba(113,175,228,0.36)' : 'rgba(255,255,255,0.06)', color: '#dbeeff', cursor: 'pointer', textTransform: 'capitalize' }}>{id}</button>
          ))}
        </div>
        <span style={{ fontSize: '0.56rem', color: '#9fd2ff', fontFamily: 'monospace' }}>{clock}</span>
      </div>

      {startOpen && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', left: 8, bottom: 38, width: 176, borderRadius: 8, border: '1px solid rgba(146,196,236,0.28)', background: 'linear-gradient(180deg, rgba(13,24,38,0.96), rgba(7,13,21,0.98))', padding: 8, boxShadow: '0 14px 24px rgba(0,0,0,0.55)', display: 'grid', gap: 5 }}>
          {apps.map(app => (
            <button key={app.id} type="button" onClick={() => open(app.id)} style={{ textAlign: 'left', fontSize: '0.56rem', color: '#dceeff', border: '1px solid rgba(146,196,236,0.22)', borderRadius: 5, background: 'rgba(255,255,255,0.04)', padding: '6px 8px', cursor: 'pointer' }}>{app.label}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function DesktopWindow({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 'min(400px, calc(100% - 20px))', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(146,196,236,0.3)', background: 'rgba(8,14,23,0.95)', boxShadow: '0 16px 28px rgba(0,0,0,0.6)' }}>
      <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', fontSize: '0.58rem', fontWeight: 600, color: '#e9f5ff', fontFamily: 'monospace', letterSpacing: '0.08em', background: 'linear-gradient(90deg, rgba(50,90,128,0.92), rgba(35,61,87,0.92))' }}>
        <span>{title}</span>
        <button type="button" onClick={onClose} style={{ width: 18, height: 18, borderRadius: 3, border: '1px solid rgba(195,220,245,0.35)', background: 'rgba(169,58,58,0.9)', color: '#fff', fontSize: '0.56rem', cursor: 'pointer' }}>X</button>
      </div>
      <div style={{ padding: 8 }}>{children}</div>
    </div>
  )
}

function Control({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid rgba(146,196,236,0.26)', background: 'rgba(120,174,220,0.2)', color: '#e8f5ff', fontSize: '0.56rem', cursor: 'pointer' }}
    >
      {label}
    </button>
  )
}
