'use client'
import React, { useEffect, useState, useRef } from 'react'

const roles = ['Full-Stack Developer', 'React Enthusiast', 'Problem Solver', 'Open to Work']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const [bgTheme, setBgTheme] = useState<'cute' | 'space'>('cute')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: ReturnType<typeof setTimeout>
    if (typing) {
      if (displayed.length < current.length) timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
      else timeout = setTimeout(() => setTyping(false), 1800)
    } else {
      if (displayed.length > 0) timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
      else { setRoleIndex((i) => (i + 1) % roles.length); setTyping(true) }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, roleIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const getZoom = () => parseFloat(document.body.style.zoom || '1') || 1
    const getW = () => window.innerWidth / getZoom()
    const getH = () => window.innerHeight / getZoom()
    let width = canvas.width = getW()
    let height = canvas.height = getH()

    const onMouseMove = (e: MouseEvent) => {
      const z = getZoom()
      mouseRef.current = { x: e.clientX / z, y: e.clientY / z }
    }
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

    type Sparkle = { x: number; y: number; size: number; twinkle: number; phase: number }
    type Charm = { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; size: number; rot: number; rotV: number; bobPhase: number; bobAmp: number; kind: 'diamond'|'star'|'heart'|'moon'|'flower'|'bow'|'clover'|'comet'; hue: number; alpha: number }
    type Trail = { x: number; y: number; r: number; life: number; driftX: number; driftY: number }
    type Star = { x:number;y:number;baseX:number;baseY:number;vx:number;vy:number;size:number;brightness:number;twinkleSpeed:number;twinklePhase:number;layer:number }
    type Nebula = { x:number;y:number;r:number;hue:number;alpha:number }
    type Streak = { x:number;y:number;vx:number;vy:number;life:number }
    type Shockwave = { x:number;y:number;r:number;maxR:number;life:number }

    let charms: Charm[] = []
    let sparkles: Sparkle[] = []
    let trails: Trail[] = []
    let stars: Star[] = []
    let nebulae: Nebula[] = []
    let streaks: Streak[] = []
    let shockwaves: Shockwave[] = []
    let lastMouse = { x: -9999, y: -9999 }
    let mouseVel = { x: 0, y: 0 }

    const initCuteScene = () => {
      const charmCount = Math.max(46, Math.floor((width * height) / 32000))
      const cx = width * 0.5
      const cy = height * 0.5
      charms = Array.from({ length: charmCount }, (_, i) => ({
        x: cx + (Math.random() - 0.5) * 80, y: cy + (Math.random() - 0.5) * 80,
        baseX: Math.random() * width, baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.28,
        size: 7 + Math.random() * 12, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.02,
        bobPhase: Math.random() * Math.PI * 2, bobAmp: 4 + Math.random() * 8,
        kind: (['diamond','star','heart','moon','flower','bow','clover','comet'] as const)[i % 8],
        hue: [329,272,158,204,43,340,128,196][i % 8], alpha: 0.42 + Math.random() * 0.28,
      }))
      const sparkleCount = Math.max(30, Math.floor((width * height) / 52000))
      sparkles = Array.from({ length: sparkleCount }, () => ({
        x: Math.random() * width, y: Math.random() * height, size: 0.8 + Math.random() * 1.8,
        twinkle: 0.001 + Math.random() * 0.0022, phase: Math.random() * Math.PI * 2,
      }))
      trails = []
      shockwaves = []
    }

    const initSpaceScene = () => {
      stars = []
      const total = Math.floor((width * height) / 3800)
      for (let i = 0; i < total; i++) {
        const layer = i % 3
        stars.push({
          x: Math.random() * width, y: Math.random() * height, baseX: Math.random() * width, baseY: Math.random() * height,
          vx: 0, vy: 0,
          size: layer === 0 ? 0.6 + Math.random() * 0.8 : layer === 1 ? 1.0 + Math.random() * 1.2 : 1.6 + Math.random() * 2.0,
          brightness: 0.3 + Math.random() * 0.7, twinkleSpeed: 0.0008 + Math.random() * 0.002, twinklePhase: Math.random() * Math.PI * 2, layer,
        })
      }
      nebulae = []
      for (let i = 0; i < 5; i++) nebulae.push({
        x: (i / 5) * width + Math.random() * (width / 5), y: Math.random() * height, r: 180 + Math.random() * 260,
        hue: [158, 180, 145, 170, 195][i], alpha: 0.025 + Math.random() * 0.03,
      })
      streaks = []
      shockwaves = []
    }

    const initScene = () => bgTheme === 'space' ? initSpaceScene() : initCuteScene()
    initScene()

    const onResize = () => { width = canvas.width = getW(); height = canvas.height = getH(); initScene() }
    const onClick = (e: MouseEvent) => {
      const z = getZoom()
      shockwaves.push({ x: e.clientX / z, y: e.clientY / z, r: 0, maxR: 220, life: 1 })
    }

    const drawCute = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const mouse = mouseRef.current
      const hasMouse = mouse.x >= 0 && mouse.y >= 0
      const baseGrad = ctx.createLinearGradient(0, 0, width, height)
      baseGrad.addColorStop(0, 'rgba(34,25,43,0.72)')
      baseGrad.addColorStop(0.45, 'rgba(24,34,41,0.68)')
      baseGrad.addColorStop(1, 'rgba(20,28,33,0.78)')
      ctx.fillStyle = baseGrad
      ctx.fillRect(0, 0, width, height)
      if (hasMouse) {
        const pointerGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180)
        pointerGlow.addColorStop(0, 'rgba(255,214,246,0.16)')
        pointerGlow.addColorStop(1, 'rgba(255,214,246,0)')
        ctx.fillStyle = pointerGlow
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2); ctx.fill()
      }
      for (let i = 0; i < charms.length; i++) {
        for (let j = i + 1; j < charms.length; j++) {
          const a = charms[i], b = charms[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 130) {
            ctx.strokeStyle = `rgba(240,215,248,${0.13 * (1 - d / 130)})`
            ctx.lineWidth = 0.8
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      for (const c of charms) {
        if (hasMouse) {
          const dx = mouse.x - c.x; const dy = mouse.y - c.y; const dist = Math.hypot(dx, dy) || 1
          if (dist < 220) {
            const force = (220 - dist) / 220; const tangent = Math.atan2(dy, dx) + Math.PI / 2
            c.vx += Math.cos(tangent) * force * 0.055; c.vy += Math.sin(tangent) * force * 0.055
            c.vx += (dx / dist) * force * 0.018; c.vy += (dy / dist) * force * 0.018; c.rotV += force * 0.01
            if (Math.random() < 0.08) trails.push({ x: c.x, y: c.y, r: 2 + Math.random() * 2, life: 1, driftX: (Math.random() - 0.5) * 0.5, driftY: -0.2 - Math.random() * 0.4 })
          }
        }
        const targetX = c.baseX + Math.cos(time * 0.0007 + c.bobPhase) * c.bobAmp
        const targetY = c.baseY + Math.sin(time * 0.0009 + c.bobPhase) * c.bobAmp
        c.vx += (targetX - c.x) * 0.018
        c.vy += (targetY - c.y) * 0.018
        c.vx *= 0.93; c.vy *= 0.93; c.rotV *= 0.92; c.x += c.vx; c.y += c.vy; c.rot += c.rotV
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot)
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, c.size * 2.3)
        glow.addColorStop(0, `hsla(${c.hue}, 88%, 82%, ${c.alpha * 0.38})`); glow.addColorStop(1, `hsla(${c.hue}, 88%, 82%, 0)`)
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, c.size * 2.3, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `hsla(${c.hue}, 90%, 84%, ${c.alpha})`; ctx.strokeStyle = `hsla(${c.hue}, 94%, 92%, ${Math.min(1, c.alpha + 0.2)})`; ctx.lineWidth = 1
        if (c.kind === 'diamond') {
          ctx.beginPath(); ctx.moveTo(0, -c.size); ctx.lineTo(c.size * 0.75, 0); ctx.lineTo(0, c.size); ctx.lineTo(-c.size * 0.75, 0); ctx.closePath(); ctx.fill(); ctx.stroke()
        } else if (c.kind === 'star') {
          ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 === 0 ? c.size : c.size * 0.45; const a = (-Math.PI / 2) + (i * Math.PI / 5); const px = Math.cos(a) * r; const py = Math.sin(a) * r; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py) } ctx.closePath(); ctx.fill(); ctx.stroke()
        } else if (c.kind === 'heart') {
          const s = c.size * 0.95; ctx.beginPath(); ctx.moveTo(0, s * 0.9); ctx.bezierCurveTo(-s * 1.15, s * 0.2, -s * 1.05, -s * 0.85, 0, -s * 0.25); ctx.bezierCurveTo(s * 1.05, -s * 0.85, s * 1.15, s * 0.2, 0, s * 0.9); ctx.closePath(); ctx.fill(); ctx.stroke()
        } else if (c.kind === 'moon') {
          const s = c.size * 0.9; ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(s * 0.45, -s * 0.15, s * 0.82, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; ctx.stroke()
        } else if (c.kind === 'flower') {
          const pr = c.size * 0.48, orbit = c.size * 0.62; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * orbit, Math.sin(a) * orbit, pr, 0, Math.PI * 2); ctx.fill(); ctx.stroke() } ctx.beginPath(); ctx.fillStyle = `hsla(${(c.hue + 28) % 360}, 95%, 88%, ${Math.min(1, c.alpha + 0.1)})`; ctx.arc(0, 0, c.size * 0.4, 0, Math.PI * 2); ctx.fill()
        } else if (c.kind === 'bow') {
          const s = c.size; ctx.beginPath(); ctx.ellipse(-s * 0.36, 0, s * 0.42, s * 0.56, -0.35, 0, Math.PI * 2); ctx.ellipse(s * 0.36, 0, s * 0.42, s * 0.56, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s * 0.12); ctx.lineTo(0, s * 0.1); ctx.strokeStyle = `hsla(${c.hue}, 88%, 96%, ${Math.min(1, c.alpha + 0.24)})`; ctx.stroke()
        } else if (c.kind === 'clover') {
          const s = c.size * 0.55, o = c.size * 0.45; ctx.beginPath(); ctx.arc(-o, -o, s, 0, Math.PI * 2); ctx.arc(o, -o, s, 0, Math.PI * 2); ctx.arc(-o, o, s, 0, Math.PI * 2); ctx.arc(o, o, s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, c.size * 0.2); ctx.lineTo(0, c.size * 1.05); ctx.strokeStyle = `hsla(${c.hue}, 85%, 90%, ${Math.min(1, c.alpha + 0.18)})`; ctx.stroke()
        } else {
          const s = c.size; ctx.beginPath(); ctx.moveTo(-s * 0.95, s * 0.2); ctx.quadraticCurveTo(-s * 0.3, -s * 0.55, s * 0.95, -s * 0.9); ctx.lineTo(s * 0.32, -s * 0.12); ctx.quadraticCurveTo(0, s * 0.15, -s * 0.95, s * 0.2); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(s * 0.98, -s * 0.95, s * 0.22, 0, Math.PI * 2); ctx.fillStyle = `hsla(${(c.hue + 30) % 360}, 95%, 90%, ${Math.min(1, c.alpha + 0.2)})`; ctx.fill()
        }
        ctx.restore()
      }
      for (const s of sparkles) {
        const pulse = Math.max(0, Math.sin(time * s.twinkle + s.phase)); const alpha = 0.11 + pulse * 0.28
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(241,224,246,${alpha})`; ctx.fill()
        if (pulse > 0.85) { ctx.strokeStyle = `rgba(255,237,252,${alpha * 0.6})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(s.x - 3, s.y); ctx.lineTo(s.x + 3, s.y); ctx.moveTo(s.x, s.y - 3); ctx.lineTo(s.x, s.y + 3); ctx.stroke() }
      }
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i]; t.x += t.driftX; t.y += t.driftY; t.life -= 0.035
        if (t.life <= 0) { trails.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,230,250,${t.life * 0.35})`; ctx.fill()
      }
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i]
        sw.r += (sw.maxR - sw.r) * 0.13
        sw.life -= 0.036
        if (sw.life <= 0) { shockwaves.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,188,236,${sw.life * 0.55})`
        ctx.lineWidth = 1.8 * sw.life
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(sw.x, sw.y, sw.r * 0.55, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(188,174,255,${sw.life * 0.4})`
        ctx.lineWidth = 1.1 * sw.life
        ctx.stroke()
      }
      animRef.current = requestAnimationFrame(drawCute)
    }

    const drawSpace = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const mouse = mouseRef.current
      const hasMouse = mouse.x > 0
      if (hasMouse) {
        mouseVel.x = mouse.x - lastMouse.x; mouseVel.y = mouse.y - lastMouse.y; lastMouse = { x: mouse.x, y: mouse.y }
        const speed = Math.hypot(mouseVel.x, mouseVel.y)
        if (speed > 8 && Math.random() < 0.6) streaks.push({ x: mouse.x + (Math.random() - 0.5) * 20, y: mouse.y + (Math.random() - 0.5) * 20, vx: -mouseVel.x * 0.3 + (Math.random() - 0.5) * 1.5, vy: -mouseVel.y * 0.3 + (Math.random() - 0.5) * 1.5, life: 1 })
      }
      const bg = ctx.createLinearGradient(0, 0, width * 0.6, height); bg.addColorStop(0, '#0a0e0b'); bg.addColorStop(0.4, '#0c1210'); bg.addColorStop(1, '#080d09')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height)
      for (const neb of nebulae) {
        const g = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r)
        g.addColorStop(0, `hsla(${neb.hue}, 60%, 35%, ${neb.alpha * 2})`); g.addColorStop(0.4, `hsla(${neb.hue}, 55%, 25%, ${neb.alpha})`); g.addColorStop(1, `hsla(${neb.hue}, 40%, 15%, 0)`)
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2); ctx.fill()
      }
      if (hasMouse) {
        const cg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 260)
        cg.addColorStop(0, 'rgba(74,155,127,0.10)'); cg.addColorStop(0.4, 'rgba(74,155,127,0.04)'); cg.addColorStop(1, 'rgba(74,155,127,0)')
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 260, 0, Math.PI * 2); ctx.fill()
      }
      const REPEL_R = 180, REPEL_F = 5.5, CONN_R = 100
      const closeStars = stars.filter(s => s.layer === 2)
      for (let i = 0; i < closeStars.length; i++) {
        for (let j = i + 1; j < closeStars.length; j++) {
          const a = closeStars[i], b = closeStars[j], d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < CONN_R) { const alpha = 0.18 * (1 - d / CONN_R) * Math.min(a.brightness, b.brightness); ctx.strokeStyle = `rgba(157,184,154,${alpha})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() }
        }
      }
      for (const s of stars) {
        const parallax = s.layer === 0 ? 0.008 : s.layer === 1 ? 0.02 : 0.045
        if (hasMouse) {
          const dx = mouse.x - s.x, dy = mouse.y - s.y, dist = Math.hypot(dx, dy) || 1
          if (dist < REPEL_R) { const force = (REPEL_R - dist) / REPEL_R; s.vx -= (dx / dist) * force * REPEL_F * parallax * 60; s.vy -= (dy / dist) * force * REPEL_F * parallax * 60 }
        }
        s.vx += (s.baseX - s.x) * 0.04 * parallax * 20; s.vy += (s.baseY - s.y) * 0.04 * parallax * 20
        s.vx *= 0.88; s.vy *= 0.88; s.x += s.vx; s.y += s.vy
        const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase); const alpha = (0.25 + twinkle * 0.75) * s.brightness
        if (s.layer === 2 && twinkle > 0.7) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5)
          glow.addColorStop(0, `rgba(196,205,184,${alpha * 0.5})`); glow.addColorStop(1, 'rgba(196,205,184,0)')
          ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2); ctx.fill()
          if (twinkle > 0.92) { ctx.strokeStyle = `rgba(196,205,184,${alpha * 0.4})`; ctx.lineWidth = 0.5; const sp = s.size * 7; ctx.beginPath(); ctx.moveTo(s.x - sp, s.y); ctx.lineTo(s.x + sp, s.y); ctx.moveTo(s.x, s.y - sp); ctx.lineTo(s.x, s.y + sp); ctx.stroke() }
        }
        const starColor = s.layer === 2 ? `rgba(196,205,184,${alpha})` : s.layer === 1 ? `rgba(157,184,154,${alpha * 0.85})` : `rgba(100,140,120,${alpha * 0.6})`
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fillStyle = starColor; ctx.fill()
      }
      for (let i = streaks.length - 1; i >= 0; i--) {
        const t = streaks[i]; t.x += t.vx; t.y += t.vy; t.vx *= 0.94; t.vy *= 0.94; t.life -= 0.055
        if (t.life <= 0) { streaks.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(t.x, t.y, 1.5 * t.life, 0, Math.PI * 2); ctx.fillStyle = `rgba(74,155,127,${t.life * 0.6})`; ctx.fill()
      }
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i]; sw.r += (sw.maxR - sw.r) * 0.12; sw.life -= 0.03
        if (sw.life <= 0) { shockwaves.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(74,155,127,${sw.life * 0.5})`; ctx.lineWidth = 1.5 * sw.life; ctx.stroke()
        ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r * 0.5, 0, Math.PI * 2); ctx.strokeStyle = `rgba(157,184,154,${sw.life * 0.3})`; ctx.lineWidth = sw.life; ctx.stroke()
      }
      animRef.current = requestAnimationFrame(drawSpace)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('click', onClick)
    animRef.current = requestAnimationFrame(bgTheme === 'space' ? drawSpace : drawCute)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('click', onClick)
    }
  }, [bgTheme])

  const orbitStates = useRef<Map<HTMLElement, { cursors: HTMLElement[], frame: number }>>(new Map())

  const startOrbit = (btn: HTMLAnchorElement, color: string) => {
    if (orbitStates.current.has(btn)) return

    const count = 12
    const cursors: HTMLElement[] = []
    const container = document.createElement('div')
    container.style.cssText = `
      position:absolute;inset:0;pointer-events:none;z-index:20;overflow:visible;
    `
    btn.appendChild(container)

    for (let i = 0; i < count; i++) {
      const c = document.createElement('div')
      c.innerHTML = `<svg width="12" height="15" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 0.5L0.5 13.5L3.5 10.5L6 16.5L8 15.5L5.5 9.5L9.5 9.5L0.5 0.5Z" fill="${color}" stroke="${color}" stroke-width="1" stroke-linejoin="round"/></svg>`
      c.style.cssText = `
        position:absolute;pointer-events:none;
        opacity:0;transition:opacity 0.3s;
        filter:drop-shadow(0 0 5px ${color});
      `
      container.appendChild(c)
      cursors.push(c)
      setTimeout(() => { c.style.opacity = String(0.4 + (i % 3) * 0.2) }, i * 40)
    }

    const cx = btn.offsetWidth / 2
    const cy = btn.offsetHeight / 2
    const rx = btn.offsetWidth / 2 + 28
    const ry = btn.offsetHeight / 2 + 22
    let angle = 0

    const animate = () => {
      cursors.forEach((c, i) => {
        const a = angle + (i / count) * Math.PI * 2
        const x = cx + rx * Math.cos(a)
        const y = cy + ry * Math.sin(a)
        const rotation = (a * 180 / Math.PI) + 45
        c.style.transform = `translate(${x - 6}px, ${y - 7}px) rotate(${rotation}deg)`
      })
      angle -= 0.025
      const state = orbitStates.current.get(btn)
      if (state) state.frame = requestAnimationFrame(animate)
    }

    const frame = requestAnimationFrame(animate)
    orbitStates.current.set(btn, { cursors, frame })
    ;(container as any)._orbitContainer = true
    btn.dataset.orbitContainer = 'true'
    ;(btn as any)._orbitContainer = container
  }

  const stopOrbit = (btn: HTMLAnchorElement) => {
    const state = orbitStates.current.get(btn)
    if (!state) return
    cancelAnimationFrame(state.frame)
    state.cursors.forEach(c => { c.style.opacity = '0' })
    setTimeout(() => {
      const container = (btn as any)._orbitContainer
      if (container && btn.contains(container)) btn.removeChild(container)
      orbitStates.current.delete(btn)
    }, 300)
  }

  // Section must fill exactly one viewport height accounting for zoom
  // otherwise About section bleeds through at >100% zoom
  const [sectionH, setSectionH] = React.useState('100vh')
  React.useEffect(() => {
    const update = () => {
      const z = parseFloat(document.body.style.zoom || '1') || 1
      setSectionH(`${window.innerHeight / z}px`)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section style={{
      minHeight: sectionH,
      height: sectionH,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Theme background canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Content */}
      <div style={{ textAlign: 'center', maxWidth: '800px', zIndex: 1, position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          gap: '0.45rem',
          padding: '0.35rem',
          marginBottom: '1rem',
          borderRadius: '999px',
          background: 'rgba(18,18,24,0.45)',
          border: '1px solid rgba(196,205,184,0.26)',
          backdropFilter: 'blur(6px)',
        }}>
          <button
            type="button"
            onClick={() => setBgTheme('cute')}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.38rem 0.92rem',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: bgTheme === 'cute' ? '#ffffff' : '#C4CDB8',
              background: bgTheme === 'cute' ? 'linear-gradient(135deg, #ee9ad4, #b9a6ff)' : 'transparent',
            }}
          >
            Cute
          </button>
          <button
            type="button"
            onClick={() => setBgTheme('space')}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.38rem 0.92rem',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: bgTheme === 'space' ? '#ffffff' : '#C4CDB8',
              background: bgTheme === 'space' ? 'linear-gradient(135deg, #4A9B7F, #2f4f47)' : 'transparent',
            }}
          >
            Space
          </button>
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(196,205,184,0.12)',
          border: '1px solid rgba(196,205,184,0.4)',
          borderRadius: '100px', padding: '0.4rem 1.2rem',
          fontSize: '0.85rem', color: '#C4CDB8',
          marginBottom: '1.8rem', fontWeight: 500,
        }}>
          ✨ Available for new opportunities
        </div>

        {/* Name */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 800, lineHeight: 1.1,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #C4CDB8 0%, #4A9B7F 50%, #9DB89A 100%)',
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
          <span style={{ color: '#9DB89A' }}>{'< '}</span>
          <span style={{ color: '#C4CDB8' }}>{displayed}</span>
          <span style={{
            display: 'inline-block', width: '2px', height: '1.2em',
            background: '#C4CDB8', marginLeft: '2px',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite'
          }} />
          <span style={{ color: '#9DB89A' }}>{' />'}</span>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: '#9DB89A', maxWidth: '560px',
          margin: '0 auto 2.5rem', lineHeight: 1.7
        }}>
          I build fast, beautiful, and scalable web apps that people actually enjoy using.
          Let's turn your ideas into reality.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://dipankarr.itch.io" target="_blank" rel="noopener noreferrer" style={{
            background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)',
            color: 'white', padding: '0.85rem 2rem',
            borderRadius: '12px', textDecoration: 'none',
            fontSize: '1rem', fontWeight: 600,
            boxShadow: '0 0 30px rgba(74,155,127,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative', overflow: 'visible',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 45px rgba(157,184,154,0.5)'
              startOrbit(e.currentTarget as HTMLAnchorElement, '#ffffff')
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(74,155,127,0.4)'
              stopOrbit(e.currentTarget as HTMLAnchorElement)
            }}
          >
            View My Work 🚀
          </a>
          <a href="#contact" style={{
            background: 'transparent',
            color: '#C4CDB8', padding: '0.85rem 2rem',
            borderRadius: '12px', textDecoration: 'none',
            fontSize: '1rem', fontWeight: 600,
            border: '1px solid rgba(196,205,184,0.5)',
            transition: 'all 0.2s',
            position: 'relative', overflow: 'visible',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(196,205,184,0.1)'
              e.currentTarget.style.borderColor = '#C4CDB8'
              startOrbit(e.currentTarget as HTMLAnchorElement, '#C4CDB8')
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(196,205,184,0.5)'
              stopOrbit(e.currentTarget as HTMLAnchorElement)
            }}
          >
            Get In Touch 💌
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: '4rem', color: '#9DB89A', fontSize: '0.85rem' }}>
          <div style={{
            width: '1px', height: '50px',
            background: 'linear-gradient(to bottom, #4A9B7F, transparent)',
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