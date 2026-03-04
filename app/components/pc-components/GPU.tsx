'use client'
import { useEffect, useRef } from 'react'

export default function GPU() {
  const fan1Ref = useRef<SVGGElement>(null)
  const fan2Ref = useRef<SVGGElement>(null)
  const fan3Ref = useRef<SVGGElement>(null)
  const angleRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const spin = () => {
      angleRef.current = (angleRef.current + 4) % 360  // fast spin
      const t = `rotate(${angleRef.current}, 28, 40)`
      const t2 = `rotate(${angleRef.current}, 98, 40)`
      const t3 = `rotate(${angleRef.current}, 168, 40)`
      if (fan1Ref.current) fan1Ref.current.setAttribute('transform', t)
      if (fan2Ref.current) fan2Ref.current.setAttribute('transform', t2)
      if (fan3Ref.current) fan3Ref.current.setAttribute('transform', t3)
      frameRef.current = requestAnimationFrame(spin)
    }
    frameRef.current = requestAnimationFrame(spin)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const FanBlades = ({ cx, cy, ref: fanRef }: { cx: number; cy: number; ref: React.RefObject<SVGGElement> }) => (
    <g ref={fanRef}>
      {[...Array(7)].map((_, b) => {
        const angle = (b / 7) * Math.PI * 2
        const x1 = cx + Math.cos(angle) * 4
        const y1 = cy + Math.sin(angle) * 4
        const x2 = cx + Math.cos(angle + 0.8) * 17
        const y2 = cy + Math.sin(angle + 0.8) * 17
        return (
          <path key={b}
            d={`M${x1},${y1} Q${cx + Math.cos(angle+0.4)*11},${cy+Math.sin(angle+0.4)*11} ${x2},${y2}`}
            stroke="rgba(74,155,127,0.8)" strokeWidth="2.5" fill="rgba(74,155,127,0.15)" strokeLinecap="round"/>
        )
      })}
    </g>
  )

  return (
    <svg width="220" height="80" viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* PCIe connector */}
      <rect x="10" y="68" width="200" height="10" rx="2" fill="#1a1a2e" stroke="#333" strokeWidth="1"/>
      {[...Array(18)].map((_, i) => (
        <rect key={i} x={14 + i * 11} y="69" width="5" height="8" rx="1" fill="#FFD700" opacity="0.8"/>
      ))}

      {/* Main PCB */}
      <rect x="5" y="12" width="210" height="56" rx="4" fill="#1a1a2e" stroke="#2a2a4e" strokeWidth="1.5"/>
      <rect x="5" y="12" width="210" height="56" rx="4" fill="url(#gpuPCB)" opacity="0.2"/>

      {/* RGB ambient strip along top — animated via CSS */}
      <rect x="6" y="13" width="208" height="5" rx="2" fill="url(#rgbStrip)" className="rgb-strip"/>

      {/* Three fan housings */}
      {[28, 98, 168].map((cx, i) => (
        <g key={i}>
          <rect x={cx - 28} y="14" width="56" height="52" rx="6" fill="#0d0d1a" stroke="#2a2a3e" strokeWidth="1"/>
          <circle cx={cx} cy="40" r="23" fill="#080810" stroke="#333" strokeWidth="1.5"/>
          <circle cx={cx} cy="40" r="19" fill="none" stroke="rgba(74,155,127,0.15)" strokeWidth="1"/>
        </g>
      ))}

      {/* Spinning fan blades */}
      <g ref={fan1Ref}>
        {[...Array(7)].map((_, b) => {
          const angle = (b / 7) * Math.PI * 2
          const x1 = 28 + Math.cos(angle) * 4, y1 = 40 + Math.sin(angle) * 4
          const x2 = 28 + Math.cos(angle + 0.8) * 17, y2 = 40 + Math.sin(angle + 0.8) * 17
          return <path key={b} d={`M${x1},${y1} Q${28+Math.cos(angle+0.4)*11},${40+Math.sin(angle+0.4)*11} ${x2},${y2}`}
            stroke="rgba(74,155,127,0.8)" strokeWidth="2.5" fill="rgba(74,155,127,0.15)" strokeLinecap="round"/>
        })}
      </g>
      <g ref={fan2Ref}>
        {[...Array(7)].map((_, b) => {
          const angle = (b / 7) * Math.PI * 2
          const x1 = 98 + Math.cos(angle) * 4, y1 = 40 + Math.sin(angle) * 4
          const x2 = 98 + Math.cos(angle + 0.8) * 17, y2 = 40 + Math.sin(angle + 0.8) * 17
          return <path key={b} d={`M${x1},${y1} Q${98+Math.cos(angle+0.4)*11},${40+Math.sin(angle+0.4)*11} ${x2},${y2}`}
            stroke="rgba(74,155,127,0.8)" strokeWidth="2.5" fill="rgba(74,155,127,0.15)" strokeLinecap="round"/>
        })}
      </g>
      <g ref={fan3Ref}>
        {[...Array(7)].map((_, b) => {
          const angle = (b / 7) * Math.PI * 2
          const x1 = 168 + Math.cos(angle) * 4, y1 = 40 + Math.sin(angle) * 4
          const x2 = 168 + Math.cos(angle + 0.8) * 17, y2 = 40 + Math.sin(angle + 0.8) * 17
          return <path key={b} d={`M${x1},${y1} Q${168+Math.cos(angle+0.4)*11},${40+Math.sin(angle+0.4)*11} ${x2},${y2}`}
            stroke="rgba(74,155,127,0.8)" strokeWidth="2.5" fill="rgba(74,155,127,0.15)" strokeLinecap="round"/>
        })}
      </g>

      {/* Center hubs */}
      {[28, 98, 168].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy="40" r="4.5" fill="#1a1a2e" stroke="rgba(74,155,127,0.6)" strokeWidth="1.5"/>
          <circle cx={cx} cy="40" r="2" fill="rgba(74,155,127,0.5)"/>
        </g>
      ))}

      {/* RGB ambient glow strip — second pass for bloom effect */}
      <rect x="6" y="13" width="208" height="3" rx="1.5" fill="url(#rgbStrip)" opacity="0.6"/>

      {/* VRAM chips */}
      {[10, 30, 50, 70].map((offset, i) => (
        <rect key={i} x={190 - offset} y="50" width="12" height="8" rx="1" fill="#111" stroke="#333" strokeWidth="0.5"/>
      ))}

      {/* Power connector */}
      <rect x="183" y="13" width="30" height="14" rx="2" fill="#111" stroke="#555" strokeWidth="1"/>
      {[187, 195, 203].map((x, i) => (
        <rect key={i} x={x} y="15" width="5" height="10" rx="1" fill="#0a0a1a" stroke="#FFD700" strokeWidth="0.5"/>
      ))}

      {/* Label */}
      <text x="14" y="44" fontFamily="monospace" fontSize="7" fill="rgba(74,155,127,0.9)" fontWeight="bold">GeForce RTX</text>
      <text x="14" y="54" fontFamily="monospace" fontSize="5" fill="rgba(157,184,154,0.6)">4090 • 24GB GDDR6X</text>

      <defs>
        <linearGradient id="gpuPCB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A9B7F"/>
          <stop offset="100%" stopColor="#2D4F47"/>
        </linearGradient>
        <linearGradient id="rgbStrip" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff0080"/>
          <stop offset="20%" stopColor="#4A9B7F"/>
          <stop offset="40%" stopColor="#0080ff"/>
          <stop offset="60%" stopColor="#ff8000"/>
          <stop offset="80%" stopColor="#ff00ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
      </defs>

      <style>{`
        .rgb-strip { animation: rgbShift 3s linear infinite; }
        @keyframes rgbShift {
          0%   { filter: hue-rotate(0deg) brightness(1.2); }
          50%  { filter: hue-rotate(180deg) brightness(1.5); }
          100% { filter: hue-rotate(360deg) brightness(1.2); }
        }
      `}</style>
    </svg>
  )
}
