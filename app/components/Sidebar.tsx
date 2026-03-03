'use client'
import { useState, useEffect } from 'react'
import { Home, User, Zap, Rocket, Briefcase, Mail } from 'lucide-react'

const navLinks = [
  { label: 'Home',       href: '#',           icon: Home      },
  { label: 'About',      href: '#about',       icon: User      },
  { label: 'Skills',     href: '#skills',      icon: Zap       },
  { label: 'Projects',   href: '#projects',    icon: Rocket    },
  { label: 'Experience', href: '#experience',  icon: Briefcase },
  { label: 'Contact',    href: '#contact',     icon: Mail      },
]

const ICON_SIZE      = 56   // collapsed width
const EXPANDED_WIDTH = 180  // expanded width
const ICON_BOX      = 28   // icon container size
const ICON_PX       = 18   // lucide icon px

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const [active,   setActive  ] = useState('#')

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) { setActive('#'); return }
      const sections = navLinks
        .filter(l => l.href !== '#')
        .map(l => document.querySelector(l.href))
        .filter(Boolean) as Element[]
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].getBoundingClientRect().top <= 200) {
          setActive('#' + sections[i].id)
          return
        }
      }
      setActive('#')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{
      position:  'fixed',
      left:      '1rem',
      top:       '50%',
      transform: 'translateY(-50%)',
      zIndex:    99,
    }}>
      <div
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          background:    'rgba(36,30,33,0.88)',
          backdropFilter:'blur(16px)',
          border:        '1px solid rgba(74,155,127,0.3)',
          borderRadius:  '22px',
          padding:       '10px 8px',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'stretch',
          gap:           '2px',
          boxShadow:     '0 8px 32px rgba(74,155,127,0.2)',
          transition:    'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflow:      'hidden',
          width:         expanded ? `${EXPANDED_WIDTH}px` : `${ICON_SIZE}px`,
          boxSizing:     'border-box',
        }}
      >
        {/* Logo */}
        <div style={{
          height:         '40px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          marginBottom:   '6px',
          flexShrink:     0,
        }}>
          <div style={{
            width:          '34px',
            height:         '34px',
            borderRadius:   '10px',
            background:     'linear-gradient(135deg, #4A9B7F, #9DB89A)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       '1.15rem',
            fontWeight:     900,
            color:          'white',
            boxShadow:      '0 0 12px rgba(74,155,127,0.5)',
            fontFamily:     'Georgia, serif',
            flexShrink:     0,
          }}>
            D
          </div>
        </div>

        {/* Nav links */}
        {navLinks.map((link, i) => {
          const isActive = active === link.href
          const Icon     = link.icon
          return (
            <a
              key={link.href}
              href={link.href}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '10px',
                height:         '40px',
                paddingLeft:    `${(ICON_SIZE - 16 - ICON_BOX) / 2}px`,
                paddingRight:   '10px',
                borderRadius:   '12px',
                textDecoration: 'none',
                flexShrink:     0,
                transition:     'background 0.2s, border 0.2s',
                background:     isActive
                  ? 'linear-gradient(135deg,rgba(74,155,127,0.35),rgba(157,184,154,0.2))'
                  : 'transparent',
                border:         isActive
                  ? '1px solid rgba(74,155,127,0.5)'
                  : '1px solid transparent',
                boxSizing:      'border-box',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(74,155,127,0.15)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* Icon box — fixed, always same size */}
              <span style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                width:          `${ICON_BOX}px`,
                height:         `${ICON_BOX}px`,
                flexShrink:     0,
              }}>
                <Icon
                  size={ICON_PX}
                  color={isActive ? '#9DB89A' : '#9DB89A'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </span>

              {/* Label */}
              <span style={{
                fontSize:   '0.85rem',
                fontWeight: isActive ? 700 : 500,
                color:      isActive ? '#C4CDB8' : '#9DB89A',
                opacity:    expanded ? 1 : 0,
                whiteSpace: 'nowrap',
                transition: `opacity 0.2s ease ${i * 0.03}s`,
                lineHeight: 1,
              }}>
                {link.label}
              </span>
            </a>
          )
        })}

        {/* Divider */}
        <div style={{
          height:     '1px',
          background: 'rgba(74,155,127,0.2)',
          margin:     '4px 4px',
          flexShrink: 0,
        }} />

        {/* Hire Me */}
        <a
          href="#contact"
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '10px',
            height:         '40px',
            paddingLeft:    `${(ICON_SIZE - 16 - ICON_BOX) / 2}px`,
            paddingRight:   '10px',
            borderRadius:   '12px',
            textDecoration: 'none',
            flexShrink:     0,
            background:     'linear-gradient(135deg,rgba(74,155,127,0.2),rgba(157,184,154,0.15))',
            border:         '1px solid rgba(74,155,127,0.35)',
            transition:     'all 0.2s',
            boxSizing:      'border-box',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background   = 'linear-gradient(135deg,rgba(74,155,127,0.4),rgba(157,184,154,0.3))'
            e.currentTarget.style.boxShadow    = '0 0 14px rgba(74,155,127,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background   = 'linear-gradient(135deg,rgba(74,155,127,0.2),rgba(157,184,154,0.15))'
            e.currentTarget.style.boxShadow    = 'none'
          }}
        >
          <span style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          `${ICON_BOX}px`,
            height:         `${ICON_BOX}px`,
            flexShrink:     0,
          }}>
            <Mail size={ICON_PX} color="#4A9B7F" strokeWidth={2} />
          </span>
          <span style={{
            fontSize:   '0.85rem',
            fontWeight: 700,
            color:      '#4A9B7F',
            opacity:    expanded ? 1 : 0,
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s ease 0.18s',
            lineHeight: 1,
          }}>
            Hire Me
          </span>
        </a>
      </div>

      {/* Bottom line */}
      <div style={{
        width:      '1px',
        height:     '50px',
        background: 'linear-gradient(to bottom,rgba(74,155,127,0.4),transparent)',
        margin:     '6px auto 0',
      }} />
    </div>
  )
}