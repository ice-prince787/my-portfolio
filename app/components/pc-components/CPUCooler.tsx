'use client'
import { useEffect, useRef } from 'react'

export default function CPUCooler() {
  const fanRef = useRef<SVGGElement>(null)
  const angleRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const spin = () => {
      angleRef.current = (angleRef.current + 2) % 360
      if (fanRef.current) {
        fanRef.current.setAttribute('transform', `rotate(${angleRef.current}, 60, 60)`)
      }
      frameRef.current = requestAnimationFrame(spin)
    }
    frameRef.current = requestAnimationFrame(spin)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Heatsink fins */}
      {[...Array(7)].map((_, i) => (
        <rect key={i} x={8 + i * 16} y="8" width="10" height="104" rx="2"
          fill={`rgba(180,180,200,${0.4 + i * 0.05})`} stroke="#555" strokeWidth="0.5"/>
      ))}
      {/* Horizontal base plate */}
      <rect x="6" y="50" width="108" height="20" rx="2" fill="#888" stroke="#666" strokeWidth="1"/>

      {/* Fan frame */}
      <rect x="12" y="12" width="96" height="96" rx="12" fill="#111" stroke="#333" strokeWidth="1.5"/>
      <rect x="14" y="14" width="92" height="92" rx="10" fill="#0a0a14"/>

      {/* Spinning blades group */}
      <g ref={fanRef}>
        {[...Array(7)].map((_, i) => {
          const angle = (i / 7) * Math.PI * 2
          const x1 = 60 + Math.cos(angle) * 5
          const y1 = 60 + Math.sin(angle) * 5
          const x2 = 60 + Math.cos(angle + 0.7) * 38
          const y2 = 60 + Math.sin(angle + 0.7) * 38
          return (
            <path key={i}
              d={`M${x1},${y1} Q${60 + Math.cos(angle + 0.35) * 25},${60 + Math.sin(angle + 0.35) * 25} ${x2},${y2} L${60},${60} Z`}
              fill="rgba(74,155,127,0.25)" stroke="rgba(74,155,127,0.6)" strokeWidth="1"/>
          )
        })}
      </g>

      {/* Center hub */}
      <circle cx="60" cy="60" r="9" fill="#222" stroke="rgba(74,155,127,0.5)" strokeWidth="1.5"/>
      <circle cx="60" cy="60" r="4" fill="rgba(74,155,127,0.6)"/>

      {/* RGB ring */}
      <circle cx="60" cy="60" r="44" fill="none" stroke="url(#coolerRgb)" strokeWidth="2" opacity="0.6"/>

      {/* Corner mounting screws */}
      {[[20,20],[100,20],[20,100],[100,100]].map(([x,y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#333" stroke="#555" strokeWidth="1"/>
          <line x1={x-3} y1={y} x2={x+3} y2={y} stroke="#666" strokeWidth="1"/>
          <line x1={x} y1={y-3} x2={x} y2={y+3} stroke="#666" strokeWidth="1"/>
        </g>
      ))}

      <defs>
        <linearGradient id="coolerRgb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff0080"/>
          <stop offset="33%" stopColor="#4A9B7F"/>
          <stop offset="66%" stopColor="#0080ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
