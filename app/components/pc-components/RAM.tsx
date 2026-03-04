'use client'

export default function RAM({ slot = 0 }: { slot?: number }) {
  const colors = ['#4A9B7F', '#4A7F9B']
  const rgb = colors[slot % 2]
  return (
    <svg width="28" height="130" viewBox="0 0 28 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* PCB body */}
      <rect x="2" y="2" width="24" height="118" rx="2" fill="#1a2a1a" stroke="#2a4a2a" strokeWidth="1"/>

      {/* RGB top strip */}
      <rect x="2" y="2" width="24" height="12" rx="2" fill={rgb} opacity="0.9"/>
      {/* RGB glow */}
      <rect x="2" y="2" width="24" height="12" rx="2" fill="url(#ramRgb)" opacity="0.7"/>

      {/* Memory chips - left column */}
      {[20, 35, 50, 65, 80, 95].map((y, i) => (
        <rect key={i} x="4" y={y} width="8" height="9" rx="1" fill="#111" stroke="#333" strokeWidth="0.5"/>
      ))}
      {/* Memory chips - right column */}
      {[20, 35, 50, 65, 80, 95].map((y, i) => (
        <rect key={i} x="16" y={y} width="8" height="9" rx="1" fill="#111" stroke="#333" strokeWidth="0.5"/>
      ))}

      {/* Heat spreader ridge */}
      <rect x="1" y="14" width="2" height="100" rx="1" fill="#333"/>
      <rect x="25" y="14" width="2" height="100" rx="1" fill="#333"/>

      {/* Gold contacts at bottom */}
      <rect x="2" y="116" width="24" height="12" rx="1" fill="#1a1a2e"/>
      {[...Array(10)].map((_, i) => (
        <rect key={i} x={3 + i * 2.3} y="117" width="1.5" height="10" rx="0.5" fill="#FFD700" opacity="0.9"/>
      ))}

      {/* Capacity label */}
      <text x="14" y="110" fontFamily="monospace" fontSize="5" fill="rgba(74,155,127,0.8)" textAnchor="middle">16GB</text>

      <defs>
        <linearGradient id="ramRgb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff0080"/>
          <stop offset="50%" stopColor="#4A9B7F"/>
          <stop offset="100%" stopColor="#0080ff"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
