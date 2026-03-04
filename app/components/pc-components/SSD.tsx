'use client'

export default function SSD() {
  return (
    <svg width="160" height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* PCB */}
      <rect x="1" y="1" width="158" height="30" rx="3" fill="#1a1a2e" stroke="#2a2a4e" strokeWidth="1"/>

      {/* NAND flash chips */}
      {[8, 38, 68, 98].map((x, i) => (
        <g key={i}>
          <rect x={x} y="4" width="24" height="14" rx="1.5" fill="#111" stroke="#333" strokeWidth="0.8"/>
          <text x={x+12} y="13" fontFamily="monospace" fontSize="4" fill="#555" textAnchor="middle">NAND</text>
        </g>
      ))}

      {/* Controller chip */}
      <rect x="128" y="3" width="26" height="16" rx="2" fill="#222" stroke="#4A9B7F" strokeWidth="0.8"/>
      <text x="141" y="10" fontFamily="monospace" fontSize="3.5" fill="rgba(74,155,127,0.8)" textAnchor="middle">CTRL</text>
      <text x="141" y="15" fontFamily="monospace" fontSize="3" fill="rgba(74,155,127,0.5)" textAnchor="middle">SM2267</text>

      {/* Activity LED */}
      <circle cx="148" cy="24" r="3" fill="rgba(74,155,127,0.9)"/>
      <circle cx="148" cy="24" r="3" fill="rgba(74,155,127,0.4)" style={{ filter: 'blur(2px)' }}/>

      {/* M.2 key connector */}
      <rect x="2" y="24" width="120" height="7" rx="1" fill="#0d0d1a"/>
      {[...Array(22)].map((_, i) => (
        <rect key={i} x={4 + i * 5.3} y="25" width="2.5" height="5" rx="0.3" fill="#FFD700" opacity="0.8"/>
      ))}

      {/* Brand label */}
      <text x="12" y="23" fontFamily="monospace" fontSize="5" fill="rgba(157,184,154,0.7)">Samsung 990 Pro • 2TB NVMe</text>
    </svg>
  )
}
