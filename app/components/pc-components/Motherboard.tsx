'use client'

export default function Motherboard() {
  return (
    <svg width="560" height="480" viewBox="0 0 560 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* PCB base */}
      <rect x="0" y="0" width="560" height="480" rx="8" fill="#1a2a1a" stroke="#2a4a2a" strokeWidth="2"/>

      {/* PCB texture / subtle grid */}
      {[...Array(14)].map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 34} x2="560" y2={i * 34} stroke="rgba(74,155,127,0.04)" strokeWidth="1"/>
      ))}
      {[...Array(17)].map((_, i) => (
        <line key={`v${i}`} x1={i * 34} y1="0" x2={i * 34} y2="480" stroke="rgba(74,155,127,0.04)" strokeWidth="1"/>
      ))}

      {/* CPU socket area */}
      <rect x="30" y="60" width="130" height="130" rx="4" fill="#111" stroke="rgba(74,155,127,0.3)" strokeWidth="1.5" strokeDasharray="4 2"/>
      <text x="95" y="132" fontFamily="monospace" fontSize="7" fill="rgba(74,155,127,0.4)" textAnchor="middle">LGA1700</text>
      {/* Socket pins grid */}
      {[...Array(8)].map((_, row) =>
        [...Array(8)].map((_, col) => (
          <circle key={`${row}-${col}`} cx={42 + col * 14} cy={72 + row * 14} r="1.5"
            fill="rgba(255,215,0,0.3)"/>
        ))
      )}

      {/* RAM slots */}
      <text x="200" y="56" fontFamily="monospace" fontSize="7" fill="rgba(74,155,127,0.4)">DDR5</text>
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={188 + i * 38} y="60" width="28" height="130" rx="2"
          fill="#111" stroke="rgba(74,155,127,0.25)" strokeWidth="1"
          strokeDasharray={i < 2 ? "none" : "3 2"}/>
      ))}

      {/* PCIe slots */}
      <text x="30" y="228" fontFamily="monospace" fontSize="7" fill="rgba(74,155,127,0.4)">PCIe x16</text>
      <rect x="30" y="232" width="340" height="20" rx="2" fill="#111" stroke="rgba(74,155,127,0.3)" strokeWidth="1"/>
      {[...Array(30)].map((_, i) => (
        <rect key={i} x={32 + i * 11} y="234" width="6" height="16" rx="0.5" fill="#1a1a1a" stroke="#333" strokeWidth="0.3"/>
      ))}

      <rect x="30" y="268" width="200" height="14" rx="2" fill="#111" stroke="#333" strokeWidth="1"/>
      {[...Array(18)].map((_, i) => (
        <rect key={i} x={32 + i * 11} y="270" width="6" height="10" rx="0.5" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="0.3"/>
      ))}
      <text x="30" y="296" fontFamily="monospace" fontSize="6" fill="rgba(74,155,127,0.25)">PCIe x1</text>

      {/* M.2 slot */}
      <text x="30" y="318" fontFamily="monospace" fontSize="7" fill="rgba(74,155,127,0.4)">M.2 NVMe</text>
      <rect x="30" y="322" width="175" height="10" rx="2" fill="#111" stroke="rgba(74,155,127,0.2)" strokeWidth="1" strokeDasharray="3 2"/>

      {/* SATA ports */}
      <text x="420" y="228" fontFamily="monospace" fontSize="7" fill="rgba(74,155,127,0.4)">SATA</text>
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={420} y={235 + i * 18} width="30" height="12" rx="2"
          fill="#111" stroke="#333" strokeWidth="1"/>
      ))}

      {/* Power connectors */}
      <rect x="420" y="60" width="50" height="35" rx="2" fill="#111" stroke="#555" strokeWidth="1"/>
      <text x="445" y="74" fontFamily="monospace" fontSize="6" fill="#555" textAnchor="middle">24-pin</text>
      <text x="445" y="84" fontFamily="monospace" fontSize="5" fill="#444" textAnchor="middle">ATX PWR</text>
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={422 + (i % 2) * 24} y={62 + Math.floor(i/2)*8} width="20" height="6" rx="1" fill="#0d0d0d" stroke="#444" strokeWidth="0.5"/>
      ))}

      {/* Chipset */}
      <rect x="310" y="340" width="50" height="50" rx="3" fill="#1a1a2e" stroke="#4A9B7F" strokeWidth="1"/>
      <text x="335" y="362" fontFamily="monospace" fontSize="6" fill="rgba(74,155,127,0.8)" textAnchor="middle">Intel</text>
      <text x="335" y="372" fontFamily="monospace" fontSize="5" fill="rgba(74,155,127,0.5)" textAnchor="middle">Z790</text>
      <text x="335" y="380" fontFamily="monospace" fontSize="4" fill="rgba(74,155,127,0.4)" textAnchor="middle">Chipset</text>

      {/* RGB header */}
      <rect x="420" y="370" width="36" height="14" rx="2" fill="#111" stroke="rgba(255,0,128,0.4)" strokeWidth="1"/>
      <text x="438" y="380" fontFamily="monospace" fontSize="5" fill="rgba(255,0,128,0.6)" textAnchor="middle">ARGB</text>

      {/* IO shield area top right */}
      <rect x="480" y="2" width="78" height="100" rx="0" fill="#111" stroke="#333" strokeWidth="1"/>
      {[['USB', 8], ['USB', 22], ['HDMI', 36], ['DP', 50], ['LAN', 64], ['AUDIO', 78]].map(([label, y]) => (
        <g key={y as number}>
          <rect x="484" y={(y as number)} width="70" height="12" rx="1" fill="#1a1a1a" stroke="#444" strokeWidth="0.5"/>
          <text x="519" y={(y as number)+8} fontFamily="monospace" fontSize="5" fill="#555" textAnchor="middle">{label as string}</text>
        </g>
      ))}

      {/* Decorative traces */}
      <path d="M160 125 L200 125 L200 190 L380 190" stroke="rgba(74,155,127,0.12)" strokeWidth="1.5" fill="none"/>
      <path d="M95 190 L95 232" stroke="rgba(74,155,127,0.1)" strokeWidth="1.5" fill="none"/>
      <path d="M380 190 L380 322 L210 322" stroke="rgba(74,155,127,0.08)" strokeWidth="1.5" fill="none"/>
      <path d="M335 340 L335 232 L374 232" stroke="rgba(74,155,127,0.1)" strokeWidth="1" fill="none"/>

      {/* Board model */}
      <text x="30" y="460" fontFamily="monospace" fontSize="7" fill="rgba(74,155,127,0.35)">ASUS ROG MAXIMUS Z790 HERO</text>
      <text x="530" y="460" fontFamily="monospace" fontSize="6" fill="rgba(74,155,127,0.2)" textAnchor="end">REV 1.02</text>
    </svg>
  )
}
