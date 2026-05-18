'use client'
import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bebas_Neue, Space_Mono } from 'next/font/google'

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'] })
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'] })

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

    const spawnOutsideCenter = () => {
      const cx = width * 0.5, cy = height * 0.5
      const avoidW = width * 0.32, avoidH = height * 0.36
      let x = Math.random() * width, y = Math.random() * height
      for (let t = 0; t < 24 && Math.abs(x - cx) < avoidW && Math.abs(y - cy) < avoidH; t++) {
        x = Math.random() * width
        y = Math.random() * height
      }
      return { x, y }
    }

    const initCuteScene = () => {
      const charmCount = Math.max(36, Math.floor((width * height) / 42000))
      charms = Array.from({ length: charmCount }, (_, i) => {
        const pos = spawnOutsideCenter()
        return {
        x: pos.x, y: pos.y,
        baseX: pos.x, baseY: pos.y,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.28,
        size: 7 + Math.random() * 12, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.02,
        bobPhase: Math.random() * Math.PI * 2, bobAmp: 4 + Math.random() * 8,
        kind: (['diamond','star','heart','moon','flower','bow','clover','comet'] as const)[i % 8],
        hue: [329,272,158,204,43,340,128,196][i % 8], alpha: 0.42 + Math.random() * 0.28,
      }})
      const sparkleCount = Math.max(18, Math.floor((width * height) / 72000))
      sparkles = Array.from({ length: sparkleCount }, () => ({
        x: Math.random() * width, y: Math.random() * height, size: 0.8 + Math.random() * 1.8,
        twinkle: 0.001 + Math.random() * 0.0022, phase: Math.random() * Math.PI * 2,
      }))
      trails = []
      shockwaves = []
    }

    const initSpaceScene = () => {
      stars = []
      const total = Math.floor((width * height) / 5200)
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
          if (d < 110) {
            ctx.strokeStyle = `rgba(240,215,248,${0.08 * (1 - d / 110)})`
            ctx.lineWidth = 0.8
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      for (const c of charms) {
        if (hasMouse) {
          const dx = mouse.x - c.x; const dy = mouse.y - c.y; const dist = Math.hypot(dx, dy) || 1
          if (dist < 180) {
            const force = (180 - dist) / 180; const tangent = Math.atan2(dy, dx) + Math.PI / 2
            c.vx += Math.cos(tangent) * force * 0.032; c.vy += Math.sin(tangent) * force * 0.032
            c.vx += (dx / dist) * force * 0.01; c.vy += (dy / dist) * force * 0.01; c.rotV += force * 0.005
            if (Math.random() < 0.03) trails.push({ x: c.x, y: c.y, r: 2 + Math.random() * 2, life: 1, driftX: (Math.random() - 0.5) * 0.5, driftY: -0.2 - Math.random() * 0.4 })
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

  type ChaosFragment = {
    t: string
    rot: number
    size: string
    color: string
    opacity: number
    top?: string
    left?: string
    right?: string
    bottom?: string
  }
  const nameLetters = 'DIPANKAR'.split('')
  const letterRots = [-5, 3, -2, 5, -3, 2, -4, 3]

  // Edge-only labels — each slot is a unique corner/edge coordinate
  const chaosFragments: ChaosFragment[] = [
    { t: 'RAW', top: '8%', left: '2%', rot: -16, size: 'clamp(1.5rem,4.5vw,2.4rem)', color: '#ff3d7f', opacity: 0.11 },
    { t: 'SHIP IT', top: '9%', right: '22%', rot: 10, size: 'clamp(0.7rem,1.5vw,0.88rem)', color: '#ffe14d', opacity: 0.6 },
    { t: '///', top: '11%', left: '28%', rot: 14, size: 'clamp(0.9rem,2vw,1.2rem)', color: '#4A9B7F', opacity: 0.22 },
    { t: 'STACK', bottom: '28%', left: '2%', rot: -12, size: 'clamp(0.65rem,1.3vw,0.8rem)', color: '#9DB89A', opacity: 0.48 },
    { t: 'REACT', bottom: '26%', right: '2%', rot: 8, size: 'clamp(0.62rem,1.25vw,0.78rem)', color: '#ff3d7f', opacity: 0.42 },
    { t: 'PUNK', top: '52%', left: '2%', rot: -20, size: 'clamp(0.7rem,1.4vw,0.85rem)', color: '#ff3d7f', opacity: 0.5 },
    { t: 'PRO', top: '52%', right: '2%', rot: 20, size: 'clamp(1.1rem,2.8vw,1.6rem)', color: '#4A9B7F', opacity: 0.09 },
    { t: '404', bottom: '8%', right: '18%', rot: 72, size: '0.58rem', color: '#9DB89A', opacity: 0.38 },
    { t: 'GET IT DONE', bottom: '8%', left: '18%', rot: 6, size: 'clamp(0.52rem,1.1vw,0.72rem)', color: '#ffe14d', opacity: 0.52 },
  ]

  return (
    <section className="hero-chaos-section" style={{
      minHeight: sectionH,
      height: sectionH,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0
      }} />

      <motion.div
        className="chaos-stage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ zIndex: 1 }}
      >
        <div className="chaos-vignette" aria-hidden />

        {/* Punk decor — edges only, never over center */}
        <motion.div className="chaos-stripe chaos-stripe-a" aria-hidden />
        <motion.div className="chaos-stripe chaos-stripe-b" aria-hidden />
        <motion.div className="chaos-stripe chaos-stripe-c" aria-hidden />
        <svg className="chaos-spike chaos-spike-tl" viewBox="0 0 80 80" aria-hidden><polygon points="0,0 80,0 0,80" fill="#ff3d7f" opacity="0.35" /></svg>
        <svg className="chaos-spike chaos-spike-tr" viewBox="0 0 80 80" aria-hidden><polygon points="80,0 80,80 0,0" fill="#ffe14d" opacity="0.3" /></svg>
        <svg className="chaos-spike chaos-spike-bl" viewBox="0 0 80 80" aria-hidden><polygon points="0,80 80,80 0,0" fill="#4A9B7F" opacity="0.28" /></svg>
        <svg className="chaos-spike chaos-spike-br" viewBox="0 0 80 80" aria-hidden><polygon points="80,80 0,80 80,0" fill="#ff3d7f" opacity="0.32" /></svg>
        <span className="chaos-pin chaos-pin-1" aria-hidden />
        <span className="chaos-pin chaos-pin-2" aria-hidden />

        <motion.div className="chaos-theme">
          <button type="button" onClick={() => setBgTheme('cute')} className={bgTheme === 'cute' ? 'active' : ''}>CUTE</button>
          <button type="button" onClick={() => setBgTheme('space')} className={bgTheme === 'space' ? 'active' : ''}>SPACE</button>
        </motion.div>

        {chaosFragments.map((f, i) => (
          <motion.span
            key={f.t}
            className="chaos-fragment"
            style={{
              top: f.top,
              left: f.left,
              right: f.right,
              bottom: f.bottom,
              fontSize: f.size,
              color: f.color,
              opacity: f.opacity,
              transform: `rotate(${f.rot}deg)`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: f.opacity, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.04 }}
          >
            {f.t}
          </motion.span>
        ))}

        {/* Central Name Elements */}
        <div className={`chaos-name-ghost ${bebas.className}`} aria-hidden>DIPANKAR</div>
        <motion.div className="chaos-name-glow" aria-hidden />

        <div className="chaos-hero-anchor">
        <motion.div
          className="chaos-hero-core"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 90 }}
        >
          <motion.span
            className="chaos-greeting"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            HI, I&apos;M
          </motion.span>
          <motion.h1
            className={`chaos-name ${bebas.className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24 }}
          >
            {nameLetters.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                className="chaos-letter"
                initial={{ opacity: 0, y: 16, rotate: letterRots[i] - 20 }}
                animate={{ opacity: 1, y: 0, rotate: letterRots[i] }}
                transition={{ delay: 0.28 + i * 0.04, type: 'spring', stiffness: 120 }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.h1>
          <motion.div
            className="chaos-name-underline"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.35 }}
          />
        </motion.div>
        </div>

        {/* Info Boxes & CTAs — each in its own zone, no overlap */}
        
        <motion.div
          className={`chaos-role ${spaceMono.className}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.42 }}
        >
          <span className="chaos-role-tag">ROLE</span>
          <span className="chaos-bracket">&lt;&lt;</span>
          <span className="chaos-role-val">{displayed}</span>
          <span className="chaos-cursor" />
          <span className="chaos-bracket">&gt;&gt;</span>
        </motion.div>

        <motion.div
          className="chaos-sticker"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring' }}
        >
          <span className="chaos-sticker-pin" />
          ⚡ OPEN FOR WORK
        </motion.div>

        <motion.p
          className="chaos-line chaos-line-a"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          I build fast, beautiful, scalable web apps —
        </motion.p>

        <motion.p
          className="chaos-line chaos-line-b"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58 }}
        >
          chaotic energy, <em>professional</em> output. I ship. You win.
        </motion.p>

        <motion.a
          href="https://dipankarr.itch.io"
          target="_blank"
          rel="noopener noreferrer"
          className="chaos-btn chaos-btn-work"
          initial={{ opacity: 0, rotate: -15 }}
          animate={{ opacity: 1, rotate: -6 }}
          transition={{ delay: 0.72 }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'rotate(-3deg) scale(1.05)'
            startOrbit(e.currentTarget as HTMLAnchorElement, '#0a0a0a')
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'rotate(-6deg)'
            stopOrbit(e.currentTarget as HTMLAnchorElement)
          }}
        >
          VIEW WORK →
        </motion.a>

        <motion.a
          href="#contact"
          className="chaos-btn chaos-btn-hire"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, type: 'spring' }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'rotate(-2deg) scale(1.06)'
            startOrbit(e.currentTarget as HTMLAnchorElement, '#0a0a0a')
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'rotate(-4deg)'
            stopOrbit(e.currentTarget as HTMLAnchorElement)
          }}
        >
          HIRE ME →
        </motion.a>

        <motion.a
          href="#contact"
          className="chaos-btn chaos-btn-contact"
          initial={{ opacity: 0, rotate: 12 }}
          animate={{ opacity: 1, rotate: 7 }}
          transition={{ delay: 0.78 }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'rotate(4deg) scale(1.05)'
            startOrbit(e.currentTarget as HTMLAnchorElement, '#ffe14d')
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'rotate(7deg)'
            stopOrbit(e.currentTarget as HTMLAnchorElement)
          }}
        >
          LET&apos;S TALK
        </motion.a>

        <motion.p
          className="chaos-line chaos-line-c"
          initial={{ opacity: 0, rotate: 12 }}
          animate={{ opacity: 1, rotate: -4 }}
          transition={{ delay: 0.64 }}
        >
          let&apos;s turn your ideas into reality
        </motion.p>

        <motion.div
          className="chaos-scroll"
          animate={{ opacity: [0.35, 1, 0.35], rotate: [-6, -2, -6] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          ↓ SCROLL
        </motion.div>

        <motion.div className="chaos-tape chaos-tape-1" aria-hidden />
        <motion.div className="chaos-tape chaos-tape-2" aria-hidden />
        <span className="chaos-x chaos-x-1" aria-hidden>✕</span>
        <span className="chaos-x chaos-x-2" aria-hidden>✕</span>
      </motion.div>

      <style>{`
        .hero-chaos-section { width: 100%; }
        .chaos-stage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .chaos-stage a,
        .chaos-stage button,
        .chaos-theme { pointer-events: auto; }
        .chaos-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 42% 38% at 50% 50%, transparent 0%, rgba(8,6,10,0.2) 50%, rgba(8,6,10,0.65) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .chaos-theme {
          position: absolute;
          top: 6.5rem; 
          right: 2.5rem; 
          display: flex;
          gap: 0.35rem;
          transform: rotate(-9deg);
          z-index: 50;
        }
        .chaos-theme button {
          border: 2px solid #ffe14d;
          background: rgba(10,10,10,0.9);
          color: #ffe14d;
          padding: 0.35rem 0.8rem;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
          transition: background 0.2s, transform 0.15s;
        }
        .chaos-theme button.active {
          background: #ff3d7f;
          color: #0a0a0a;
          border-color: #ff3d7f;
          box-shadow: 4px 4px 0 #0a0a0a;
        }
        .chaos-fragment {
          position: absolute;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          pointer-events: none;
          z-index: 3;
          line-height: 1;
        }

        /* Static center anchor — framer scale must NOT touch this transform */
        .chaos-hero-anchor {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 50;
          pointer-events: none;
          width: min(92vw, 960px);
        }
        .chaos-hero-core {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          padding: 0.5rem;
        }
        .chaos-greeting {
          display: block;
          margin: 0 0 0.15em;
          font-size: clamp(0.95rem, 2.5vw, 1.6rem);
          font-weight: 800;
          color: #ff3d7f;
          letter-spacing: 0.32em;
          text-shadow: 3px 3px 0 #0a0a0a;
          text-align: center;
        }
        .chaos-name {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: baseline;
          gap: 0.02em 0.04em;
          margin: 0;
          padding: 0;
          font-size: clamp(3.5rem, 18vw, 12rem);
          font-weight: 400;
          line-height: 0.9;
          color: #F4F7EE;
          filter: drop-shadow(0 0 28px rgba(244,247,238,0.28));
          animation: chaos-name-pulse 6s ease-in-out infinite;
        }
        .chaos-letter {
          display: inline-block;
          text-shadow:
            3px 3px 0 #0a0a0a,
            -1px 0 0 #ff3d7f,
            1px 0 0 #4A9B7F;
        }
        @keyframes chaos-name-pulse {
          0%, 100% { filter: drop-shadow(0 0 24px rgba(244,247,238,0.22)); }
          50% { filter: drop-shadow(0 0 34px rgba(244,247,238,0.35)); }
        }
        .chaos-name-underline {
          height: 6px;
          width: min(85%, 620px);
          margin-top: 0.35em;
          background: repeating-linear-gradient(
            88deg,
            #ff3d7f 0, #ff3d7f 14px,
            transparent 14px, transparent 20px,
            #ffe14d 20px, #ffe14d 32px,
            transparent 32px, transparent 38px
          );
          transform-origin: center;
        }
        .chaos-name-ghost {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(2deg);
          font-size: clamp(3.5rem, 18vw, 12rem);
          letter-spacing: 0.08em;
          line-height: 0.9;
          color: #ff3d7f;
          opacity: 0.04;
          z-index: 4;
          pointer-events: none;
          white-space: nowrap;
          filter: blur(3px);
        }
        .chaos-name-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(85vw, 820px);
          height: clamp(100px, 20vh, 200px);
          background: radial-gradient(ellipse at center, rgba(244,247,238,0.14) 0%, transparent 68%);
          z-index: 5;
          pointer-events: none;
        }

        /* Punk stripes & spikes — perimeter only */
        .chaos-stripe {
          position: absolute;
          pointer-events: none;
          z-index: 2;
        }
        .chaos-stripe-a {
          top: 14%;
          left: -8%;
          width: 116%;
          height: 14px;
          transform: rotate(-11deg);
          background: repeating-linear-gradient(90deg, #ffe14d 0, #ffe14d 16px, #0a0a0a 16px, #0a0a0a 32px);
          opacity: 0.75;
          box-shadow: 0 2px 0 #ff3d7f;
        }
        .chaos-stripe-b {
          bottom: 32%;
          left: -6%;
          width: 112%;
          height: 12px;
          transform: rotate(7deg);
          background: repeating-linear-gradient(90deg, #ff3d7f 0, #ff3d7f 12px, transparent 12px, transparent 20px);
          opacity: 0.5;
        }
        .chaos-stripe-c {
          bottom: 4%;
          left: -5%;
          width: 110%;
          height: 10px;
          transform: rotate(-5deg);
          background: repeating-linear-gradient(90deg, #4A9B7F 0, #4A9B7F 10px, #ffe14d 10px, #ffe14d 18px);
          opacity: 0.45;
        }
        .chaos-spike {
          position: absolute;
          width: clamp(48px, 8vw, 80px);
          height: clamp(48px, 8vw, 80px);
          pointer-events: none;
          z-index: 2;
        }
        .chaos-spike-tl { top: 0; left: 0; }
        .chaos-spike-tr { top: 0; right: 0; }
        .chaos-spike-bl { bottom: 0; left: 0; }
        .chaos-spike-br { bottom: 0; right: 0; }
        .chaos-pin {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff 0%, #ff3d7f 40%, #0a0a0a 42%);
          border: 2px solid #0a0a0a;
          box-shadow: 2px 3px 0 #0a0a0a;
          z-index: 6;
          pointer-events: none;
        }
        .chaos-pin-1 { top: 22%; left: 14%; transform: rotate(-18deg); }
        .chaos-pin-2 { top: 24%; right: 16%; transform: rotate(24deg); }

        /* Zone: top-left */
        .chaos-role {
          position: absolute;
          top: 11%; 
          left: 3%;
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem 0.55rem;
          padding: 0.6rem 0.95rem;
          background: rgba(8,8,8,0.94);
          border: 2px dashed #4A9B7F;
          box-shadow: 6px 6px 0 rgba(255,61,127,0.5);
          font-size: clamp(0.7rem, 1.6vw, 0.95rem);
          max-width: min(36vw, 360px);
          z-index: 18;
          transform: rotate(-5deg);
        }
        .chaos-role-tag {
          font-size: 0.6em;
          font-weight: 700;
          color: #ff3d7f;
          letter-spacing: 0.25em;
        }
        .chaos-bracket { color: #ffe14d; font-weight: 700; }
        .chaos-role-val { color: #C4CDB8; font-weight: 700; }
        .chaos-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: #ffe14d;
          vertical-align: middle;
          animation: blink 1s step-end infinite;
        }

        /* Zone: top-right (left of theme toggles) */
        .chaos-sticker {
          position: absolute;
          top: 11%;
          right: 20%;
          transform: rotate(6deg);
          background: #ffe14d;
          color: #0a0a0a;
          font-size: clamp(0.65rem, 1.5vw, 0.85rem);
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 0.5rem 1.1rem;
          box-shadow: 4px 4px 0 #0a0a0a;
          clip-path: polygon(3% 10%, 97% 0, 100% 90%, 0 100%);
          z-index: 20;
          animation: chaos-jitter 5s ease-in-out infinite;
        }
        .chaos-sticker-pin {
          position: absolute;
          top: -7px;
          left: 50%;
          width: 11px;
          height: 11px;
          background: #ff3d7f;
          border: 2px solid #0a0a0a;
          border-radius: 50%;
          transform: translateX(-50%);
        }

        .chaos-line {
          position: absolute;
          font-size: clamp(0.85rem, 1.8vw, 1.05rem);
          color: #9DB89A;
          line-height: 1.45;
          padding: 0.4rem 0.75rem;
          background: rgba(8,8,8,0.55);
          border-left: 3px solid #ff3d7f;
          max-width: min(42vw, 380px);
          z-index: 15;
          pointer-events: none;
        }
        .chaos-line em {
          font-style: normal;
          color: #ffe14d;
          font-weight: 800;
          text-decoration: underline wavy #ff3d7f;
        }

        /* Zone: mid-left / mid-right — clear of center column */
        .chaos-line-a {
          top: 56%;
          left: 2%;
          transform: rotate(-4deg);
          border-left-color: #ff3d7f;
          max-width: min(22vw, 240px);
        }

        .chaos-line-b {
          top: 56%;
          right: 2%;
          transform: rotate(3deg);
          border-left-color: #ffe14d;
          max-width: min(22vw, 240px);
        }

        /* Zone: above bottom CTAs */
        .chaos-line-c {
          bottom: 22%;
          left: 50%;
          transform: translateX(-50%) rotate(-3deg);
          font-size: clamp(0.68rem, 1.2vw, 0.85rem);
          color: #4A9B7F;
          border-left: none;
          border-top: 2px dashed #4A9B7F;
          background: rgba(8,8,8,0.55);
          padding: 0.35rem 0.75rem;
          max-width: min(52vw, 420px);
          text-align: center;
        }

        .chaos-btn {
          position: absolute;
          text-decoration: none;
          font-size: clamp(0.85rem, 1.6vw, 1rem);
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.9rem 1.7rem;
          z-index: 25;
          transition: transform 0.2s;
        }
        
        /* Zone: bottom row — three separate slots */
        .chaos-btn-work {
          bottom: 10%;
          left: 4%;
          background: #ffe14d;
          color: #0a0a0a;
          border: 3px solid #0a0a0a;
          box-shadow: 6px 6px 0 #ff3d7f;
          transform: rotate(-8deg);
        }

        .chaos-btn-hire {
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%) rotate(-4deg);
          background: #ff3d7f;
          color: #0a0a0a;
          border: 3px solid #0a0a0a;
          box-shadow: 7px 7px 0 #ffe14d, 0 0 28px rgba(255,61,127,0.45);
          font-size: clamp(0.95rem, 1.9vw, 1.15rem);
          padding: 1rem 2.2rem;
          clip-path: polygon(2% 0, 100% 4%, 98% 100%, 0 96%);
          animation: chaos-hire-pulse 2.8s ease-in-out infinite;
        }
        @keyframes chaos-hire-pulse {
          0%, 100% { box-shadow: 7px 7px 0 #ffe14d, 0 0 22px rgba(255,61,127,0.35); }
          50% { box-shadow: 8px 8px 0 #ffe14d, 0 0 36px rgba(255,61,127,0.55); }
        }

        .chaos-btn-contact {
          bottom: 10%;
          right: 4%;
          background: rgba(8,8,8,0.92);
          color: #C4CDB8;
          border: 2px solid #C4CDB8;
          box-shadow: 5px 5px 0 rgba(74,155,127,0.6);
          transform: rotate(8deg);
        }

        .chaos-scroll {
          position: absolute;
          bottom: 3%;
          left: 50%;
          transform: translateX(-50%) rotate(-6deg);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.35em;
          color: #4A9B7F;
          z-index: 12;
          pointer-events: none;
        }

        .chaos-tape {
          position: absolute;
          height: 28px;
          background: repeating-linear-gradient(
            -45deg,
            rgba(255,225,77,0.45),
            rgba(255,225,77,0.45) 8px,
            rgba(255,61,127,0.35) 8px,
            rgba(255,61,127,0.35) 16px
          );
          z-index: 3;
          pointer-events: none;
        }
        .chaos-tape-1 {
          top: 3%;
          left: -6%;
          width: 112%;
          height: 20px;
          transform: rotate(-7deg);
          opacity: 0.8;
        }
        .chaos-tape-2 {
          bottom: 10%;
          left: -5%;
          width: 110%;
          height: 18px;
          transform: rotate(4deg);
          opacity: 0.4;
        }
        .chaos-x {
          position: absolute;
          font-size: clamp(1.4rem, 3.5vw, 2.4rem);
          color: #ff3d7f;
          opacity: 0.1;
          font-weight: 900;
          z-index: 4;
          pointer-events: none;
        }
        .chaos-x-1 { top: 10%; left: 2.5%; transform: rotate(14deg); }
        .chaos-x-2 { bottom: 10%; right: 2.5%; transform: rotate(-12deg); color: #ffe14d; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes chaos-jitter {
          0%, 100% { transform: rotate(6deg) translate(0, 0); }
          50% { transform: rotate(5deg) translate(1px, -1px); }
        }
        
        /* Mobile — stack bottom row, keep name centered */
        @media (max-width: 900px) {
          .chaos-hero-anchor { width: 96vw; }
          .chaos-name, .chaos-name-ghost { font-size: clamp(2.8rem, 16vw, 7rem); }
          .chaos-line-a { top: 62%; max-width: 38vw; }
          .chaos-line-b { top: 62%; max-width: 38vw; }
          .chaos-sticker { right: 4%; top: 10%; }
        }
        @media (max-width: 640px) {
          .chaos-greeting { font-size: 0.8rem; letter-spacing: 0.2em; }
          .chaos-name { font-size: clamp(2.4rem, 15vw, 4.5rem); }
          .chaos-name-ghost { font-size: clamp(2.4rem, 15vw, 4.5rem); }
          .chaos-sticker { top: 9%; right: 3%; font-size: 0.52rem; }
          .chaos-line-a { top: 68%; left: 2%; max-width: 46vw; }
          .chaos-line-b { display: none; }
          .chaos-line-c { bottom: 26%; max-width: 88vw; }
          .chaos-btn-work { bottom: 14%; left: 3%; }
          .chaos-btn-hire { bottom: 6%; padding: 0.75rem 1.4rem; font-size: 0.8rem; }
          .chaos-btn-contact { bottom: 14%; right: 3%; }
          .chaos-role { top: 9%; max-width: 72vw; }
          .chaos-theme { top: 5rem; right: 1rem; transform: rotate(-6deg); }
          .chaos-btn { padding: 0.6rem 1rem; font-size: 0.72rem; }
        }
      `}</style>
    </section>
  )
}