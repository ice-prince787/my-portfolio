'use client'

export default function CPU() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* IHS (Integrated Heat Spreader) */}
      <rect x="5" y="5" width="80" height="80" rx="6" fill="#C0C0C0" stroke="#888" strokeWidth="1.5"/>
      <rect x="8" y="8" width="74" height="74" rx="5" fill="#A8A8A8"/>

      {/* Die area (darker center) */}
      <rect x="22" y="22" width="46" height="46" rx="3" fill="#1a1a2e" stroke="#333" strokeWidth="1"/>

      {/* Die detail grid */}
      {[28, 36, 44, 52].map(x =>
        [28, 36, 44, 52].map(y => (
          <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" rx="0.5"
            fill={Math.abs(x - y) % 12 === 0 ? 'rgba(74,155,127,0.5)' : '#222'}
            stroke="#333" strokeWidth="0.3"/>
        ))
      )}

      {/* Center glow */}
      <circle cx="45" cy="45" r="8" fill="rgba(74,155,127,0.15)" stroke="rgba(74,155,127,0.4)" strokeWidth="1"/>
      <circle cx="45" cy="45" r="4" fill="rgba(74,155,127,0.3)"/>

      {/* LGA pins - top */}
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={10 + i * 9} y="2" width="3" height="4" rx="0.5" fill="#FFD700" opacity="0.8"/>
      ))}
      {/* LGA pins - bottom */}
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={10 + i * 9} y="84" width="3" height="4" rx="0.5" fill="#FFD700" opacity="0.8"/>
      ))}
      {/* LGA pins - left */}
      {[...Array(8)].map((_, i) => (
        <rect key={i} x="2" y={10 + i * 9} width="4" height="3" rx="0.5" fill="#FFD700" opacity="0.8"/>
      ))}
      {/* LGA pins - right */}
      {[...Array(8)].map((_, i) => (
        <rect key={i} x="84" y={10 + i * 9} width="4" height="3" rx="0.5" fill="#FFD700" opacity="0.8"/>
      ))}

      {/* Brand marking */}
      <text x="45" y="19" fontFamily="monospace" fontSize="5" fill="rgba(200,200,200,0.7)" textAnchor="middle">Intel</text>
      <text x="45" y="76" fontFamily="monospace" fontSize="4" fill="rgba(150,150,150,0.5)" textAnchor="middle">i9-13900K</text>
    </svg>
  )
}
