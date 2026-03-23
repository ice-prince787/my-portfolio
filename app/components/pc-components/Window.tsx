'use client'

import { useEffect, useRef } from 'react'

export default function Window() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let viewW = 0
    let viewH = 0
    let drops: Drop[] = []
    let buildings: Building[] = []

    type Building = { x: number; w: number; h: number; rows: number; cols: number; lights: boolean[] }
    type Drop = { x: number; y: number; len: number; speed: number; drift: number }

    const rebuildScene = () => {
      viewW = Math.max(260, Math.floor(host.clientWidth))
      viewH = Math.max(170, Math.floor(host.clientHeight))

      canvas.width = Math.floor(viewW * dpr)
      canvas.height = Math.floor(viewH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      buildings = []
      let cursorX = -8
      while (cursorX < viewW + 30) {
        const w = 24 + Math.random() * 28
        const h = 44 + Math.random() * 74
        const cols = 2 + Math.floor(Math.random() * 3)
        const rows = 4 + Math.floor(Math.random() * 5)
        const lights = Array.from({ length: cols * rows }, () => Math.random() > 0.58)
        buildings.push({ x: cursorX, w, h, rows, cols, lights })
        cursorX += w + 6 + Math.random() * 8
      }

      drops = Array.from({ length: Math.floor(viewW * 0.42) }, () => ({
        x: Math.random() * (viewW + 40) - 20,
        y: Math.random() * viewH,
        len: 8 + Math.random() * 16,
        speed: 2.4 + Math.random() * 2.7,
        drift: -0.9 + Math.random() * 0.4,
      }))
    }
    rebuildScene()

    let frameId = 0
    let nextFlicker = performance.now() + 380

    const animate = (time: number) => {
      ctx.clearRect(0, 0, viewW, viewH)

      // Night sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, viewH)
      sky.addColorStop(0, '#4c6189')
      sky.addColorStop(0.45, '#334869')
      sky.addColorStop(1, '#1d2b42')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, viewW, viewH)

      // Moon + haze
      const moonX = viewW * 0.67
      const moonY = 34
      ctx.beginPath()
      ctx.arc(moonX, moonY, 13, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(238,244,255,0.86)'
      ctx.fill()
      const haze = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 44)
      haze.addColorStop(0, 'rgba(214,227,255,0.34)')
      haze.addColorStop(1, 'rgba(214,227,255,0)')
      ctx.fillStyle = haze
      ctx.fillRect(moonX - 44, -12, 92, 92)

      // Skyline
      for (const b of buildings) {
        const y = viewH - b.h
        ctx.fillStyle = '#1a2437'
        ctx.fillRect(b.x, y, b.w, b.h)
        ctx.fillStyle = 'rgba(0,0,0,0.16)'
        ctx.fillRect(b.x + b.w - 3, y, 3, b.h)

        const gapX = 4
        const gapY = 4
        const winW = Math.max(2, (b.w - (b.cols + 1) * gapX) / b.cols)
        const winH = Math.max(2, (b.h - 10 - (b.rows + 1) * gapY) / b.rows)

        for (let r = 0; r < b.rows; r++) {
          for (let c = 0; c < b.cols; c++) {
            const i = r * b.cols + c
            const wx = b.x + gapX + c * (winW + gapX)
            const wy = y + 6 + gapY + r * (winH + gapY)
            if (b.lights[i]) {
              ctx.fillStyle = 'rgba(255,214,148,0.86)'
              ctx.fillRect(wx, wy, winW, winH)
            } else {
              ctx.fillStyle = 'rgba(20,28,40,0.85)'
              ctx.fillRect(wx, wy, winW, winH)
            }
          }
        }
      }

      // Foreground dark fade
      const horizonFade = ctx.createLinearGradient(0, viewH - 68, 0, viewH)
      horizonFade.addColorStop(0, 'rgba(12,16,24,0)')
      horizonFade.addColorStop(1, 'rgba(7,10,16,0.92)')
      ctx.fillStyle = horizonFade
      ctx.fillRect(0, viewH - 68, viewW, 68)

      // Rain
      ctx.strokeStyle = 'rgba(196,216,255,0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (const d of drops) {
        d.x += d.drift
        d.y += d.speed
        if (d.y > viewH + 20) {
          d.y = -20
          d.x = Math.random() * (viewW + 40) - 20
        }
        if (d.x < -24) d.x = viewW + 18
        if (d.x > viewW + 24) d.x = -18
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x + d.drift * 2.1, d.y + d.len)
      }
      ctx.stroke()

      // Glass reflections
      const glass = ctx.createLinearGradient(0, 0, viewW, viewH)
      glass.addColorStop(0, 'rgba(255,255,255,0.11)')
      glass.addColorStop(0.33, 'rgba(255,255,255,0.02)')
      glass.addColorStop(0.7, 'rgba(255,255,255,0.06)')
      glass.addColorStop(1, 'rgba(255,255,255,0.01)')
      ctx.fillStyle = glass
      ctx.fillRect(0, 0, viewW, viewH)

      // Occasional window light flicker
      if (time > nextFlicker) {
        nextFlicker = time + 260 + Math.random() * 460
        for (let t = 0; t < 6; t++) {
          const b = buildings[Math.floor(Math.random() * buildings.length)]
          const i = Math.floor(Math.random() * b.lights.length)
          b.lights[i] = Math.random() > 0.5
        }
      }

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    const onResize = () => rebuildScene()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div style={{
      position: 'absolute',
      right: '7%',
      top: '10%',
      width: 420,
      height: 270,
      borderRadius: 14,
      background: '#10151b',
      border: '8px solid #343940',
      boxShadow: '0 16px 34px rgba(0,0,0,0.46)',
    }}>
      <div style={{
        position: 'absolute',
        inset: 10,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 6, marginLeft: -3, background: '#343940' }} />
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 6, marginTop: -3, background: '#343940' }} />
    </div>
  )
}
