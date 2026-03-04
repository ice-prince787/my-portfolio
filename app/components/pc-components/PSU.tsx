'use client'
import { useEffect, useRef } from 'react'

export default function PSU() {
  const fanRef = useRef<SVGGElement>(null)
  const angleRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const spin = () => {
      angleRef.current = (angleRef.current + 3) % 360
      if (fanRef.current) {
        fanRef.current.setAttribute('transform', `rotate(${angleRef.current}, 32, 35)`)
      }
      frameRef.current = requestAnimationFrame(spin)
    }
    frameRef.current = requestAnimationFrame(spin)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <svg width="130" height="70" viewBox="0 0 130 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main body */}
      <rect x="1" y="1" width="128" height="68" rx="5" fill="#1a1a1a" stroke="#333" strokeWidth="1.5"/>
      <rect x="3" y="3" width="124" height="64" rx="4" fill="#222"/>

      {/* Fan area left */}
      <rect x="5" y="5" width="55" height="60" rx="3" fill="#111"/>
      <circle cx="32" cy="35" r="23" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="1.5"/>
      <circle cx="32" cy="35" r="19" fill="none" stroke="rgba(74,155,127,0.15)" strokeWidth="1"/>

      {/* Grill lines */}
      {[10,16,22,28,34,40,46,52,58].map(y => (
        <line key={y} x1="7" y1={y} x2="58" y2={y} stroke="#2a2a2a" strokeWidth="0.5"/>
      ))}

      {/* Spinning fan */}
      <g ref={fanRef}>
        {[...Array(7)].map((_, b) => {
          const angle = (b / 7) * Math.PI * 2
          const x1 = 32 + Math.cos(angle) * 4, y1 = 35 + Math.sin(angle) * 4
          const x2 = 32 + Math.cos(angle + 0.8) * 17, y2 = 35 + Math.sin(angle + 0.8) * 17
          return <path key={b} d={`M${x1},${y1} Q${32+Math.cos(angle+0.4)*11},${35+Math.sin(angle+0.4)*11} ${x2},${y2}`}
            stroke="rgba(74,155,127,0.7)" strokeWidth="2" fill="rgba(74,155,127,0.1)" strokeLinecap="round"/>
        })}
      </g>
      <circle cx="32" cy="35" r="4.5" fill="#1a1a1a" stroke="rgba(74,155,127,0.5)" strokeWidth="1.5"/>
      <circle cx="32" cy="35" r="2" fill="rgba(74,155,127,0.5)"/>

      {/* Right panel */}
      <rect x="63" y="5" width="62" height="60" rx="2" fill="#1a1a1a"/>
      <text x="94" y="22" fontFamily="monospace" fontSize="8" fill="#4A9B7F" textAnchor="middle" fontWeight="bold">CORSAIR</text>
      <text x="94" y="32" fontFamily="monospace" fontSize="4.5" fill="rgba(157,184,154,0.6)" textAnchor="middle">RM1000x • 80+ Gold</text>

      {[['24-pin ATX', 42], ['EPS 8-pin', 52]].map(([label, y]) => (
        <g key={y as number}>
          <rect x="67" y={(y as number) - 5} width="54" height="8" rx="1" fill="#111" stroke="#333" strokeWidth="0.5"/>
          <text x="94" y={(y as number)+1} fontFamily="monospace" fontSize="4" fill="#555" textAnchor="middle">{label as string}</text>
        </g>
      ))}

      <rect x="115" y="28" width="12" height="8" rx="2" fill="#111" stroke="#4A9B7F" strokeWidth="1"/>
      <text x="121" y="34" fontFamily="monospace" fontSize="4.5" fill="#4A9B7F" textAnchor="middle">I/O</text>

      {/* Green power LED */}
      <circle cx="120" cy="20" r="3" fill="rgba(74,255,74,0.9)"/>
      <circle cx="120" cy="20" r="4" fill="rgba(74,255,74,0.3)" style={{filter:'blur(2px)'}}/>
    </svg>
  )
}
