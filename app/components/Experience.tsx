'use client'
import { useEffect, useRef } from 'react'

// ── Floating toy definitions ─────────────────────────────

function FloatingToys() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>

      {/* ── WOODEN BLOCK A ── */}
      <div style={{ position:'absolute', left:'4%', top:'8%', animation:'wobble 3s ease-in-out infinite' }}>
        <svg width="54" height="54" viewBox="0 0 54 54">
          <rect x="4" y="4" width="46" height="46" rx="6" fill="#E8A838" stroke="#c47f1a" strokeWidth="2"/>
          <rect x="4" y="4" width="46" height="46" rx="6" fill="url(#woodGrain)" opacity="0.3"/>
          <text x="27" y="34" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff" fontFamily="Arial Black, sans-serif">A</text>
          <defs>
            <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="8" height="8">
              <line x1="0" y1="0" x2="8" y2="8" stroke="#c47f1a" strokeWidth="1" opacity="0.4"/>
            </pattern>
          </defs>
        </svg>
      </div>

      {/* ── WOODEN BLOCK B ── */}
      <div style={{ position:'absolute', left:'3%', top:'28%', animation:'wobble 3.8s ease-in-out 0.6s infinite' }}>
        <svg width="54" height="54" viewBox="0 0 54 54">
          <rect x="4" y="4" width="46" height="46" rx="6" fill="#E74C3C" stroke="#c0392b" strokeWidth="2"/>
          <text x="27" y="34" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff" fontFamily="Arial Black, sans-serif">B</text>
          {/* little shine */}
          <rect x="8" y="8" width="14" height="6" rx="3" fill="white" opacity="0.25"/>
        </svg>
      </div>

      {/* ── CRAYON ── */}
      <div style={{ position:'absolute', left:'6%', top:'50%', animation:'crayonWiggle 2.5s ease-in-out 0.3s infinite' }}>
        <svg width="28" height="72" viewBox="0 0 28 72">
          {/* body */}
          <rect x="6" y="16" width="16" height="44" rx="3" fill="#4ECDC4"/>
          <rect x="6" y="16" width="16" height="44" rx="3" fill="white" opacity="0.1"/>
          {/* label */}
          <rect x="6" y="28" width="16" height="18" fill="white" opacity="0.25"/>
          {/* tip cone */}
          <polygon points="14,68 6,60 22,60" fill="#2D3436"/>
          <polygon points="14,72 8,64 20,64" fill="#45B7D1"/>
          {/* top cap */}
          <rect x="6" y="10" width="16" height="8" rx="2" fill="#2D3436"/>
          {/* shine */}
          <rect x="9" y="18" width="4" height="20" rx="2" fill="white" opacity="0.2"/>
        </svg>
      </div>

      {/* ── PINWHEEL ── */}
      <div style={{ position:'absolute', left:'5%', top:'72%', animation:'float 4s ease-in-out 1s infinite alternate' }}>
        <svg width="60" height="72" viewBox="0 0 60 72">
          {/* stick */}
          <line x1="30" y1="36" x2="30" y2="72" stroke="#b2bec3" strokeWidth="4" strokeLinecap="round"/>
          {/* spinning blades */}
          <g style={{ transformOrigin:'30px 30px', animation:'toySpin 1.5s linear infinite' }}>
            <path d="M30 30 Q30 10 18 10 Q18 30 30 30" fill="#FF6B6B"/>
            <path d="M30 30 Q50 30 50 18 Q30 18 30 30" fill="#FFD93D"/>
            <path d="M30 30 Q30 50 42 50 Q42 30 30 30" fill="#4ECDC4"/>
            <path d="M30 30 Q10 30 10 42 Q30 42 30 30" fill="#A29BFE"/>
          </g>
          {/* center hub */}
          <circle cx="30" cy="30" r="5" fill="#2D3436"/>
          <circle cx="30" cy="30" r="3" fill="#FFD93D"/>
        </svg>
      </div>

      {/* ── YO-YO ── */}
      <div style={{ position:'absolute', right:'4%', top:'6%', animation:'yoyo 2.2s ease-in-out infinite' }}>
        <svg width="52" height="70" viewBox="0 0 52 70">
          {/* string */}
          <line x1="26" y1="0" x2="26" y2="22" stroke="#dfe6e9" strokeWidth="2"/>
          {/* yo-yo body */}
          <ellipse cx="26" cy="38" rx="22" ry="10" fill="#6C5CE7"/>
          <circle cx="26" cy="38" r="18" fill="#A29BFE"/>
          <ellipse cx="26" cy="38" rx="22" ry="10" fill="#6C5CE7" opacity="0.7"/>
          {/* center groove */}
          <ellipse cx="26" cy="38" rx="5" ry="9" fill="#6C5CE7"/>
          {/* shine */}
          <ellipse cx="20" cy="32" rx="5" ry="3" fill="white" opacity="0.3" transform="rotate(-20, 20, 32)"/>
          {/* star pattern */}
          <circle cx="26" cy="38" r="4" fill="#FFD93D"/>
          <circle cx="26" cy="38" r="2" fill="#fdcb6e"/>
        </svg>
      </div>

      {/* ── RUBBER DUCK (improved) ── */}
      <div style={{ position:'absolute', right:'3%', top:'28%', animation:'duckBob 2.8s ease-in-out 0.5s infinite' }}>
        <svg width="64" height="60" viewBox="0 0 64 60">
          {/* body */}
          <ellipse cx="32" cy="42" rx="26" ry="16" fill="#FFD93D"/>
          {/* wing */}
          <ellipse cx="44" cy="40" rx="10" ry="7" fill="#ffeaa7" opacity="0.7"/>
          {/* head */}
          <circle cx="22" cy="24" r="16" fill="#FFD93D"/>
          {/* beak */}
          <ellipse cx="10" cy="26" rx="9" ry="5" fill="#FF922B"/>
          <ellipse cx="10" cy="24" rx="9" ry="4" fill="#e67e22"/>
          {/* nostril */}
          <circle cx="7" cy="23" r="1.5" fill="#c0392b"/>
          {/* eye */}
          <circle cx="24" cy="20" r="5" fill="#2D3436"/>
          <circle cx="26" cy="18" r="2" fill="white"/>
          {/* blush */}
          <circle cx="30" cy="26" r="4" fill="#ff7675" opacity="0.4"/>
          {/* water ripple */}
          <ellipse cx="32" cy="56" rx="28" ry="4" fill="#74b9ff" opacity="0.3"/>
        </svg>
      </div>

      {/* ── TOY CAR (improved) ── */}
      <div style={{ position:'absolute', right:'5%', top:'50%', animation:'carDrive 4s ease-in-out 1.2s infinite alternate' }}>
        <svg width="80" height="52" viewBox="0 0 80 52">
          {/* shadow */}
          <ellipse cx="40" cy="50" rx="32" ry="4" fill="black" opacity="0.15"/>
          {/* body */}
          <rect x="4" y="22" width="72" height="22" rx="6" fill="#E74C3C"/>
          {/* roof */}
          <rect x="16" y="10" width="42" height="18" rx="8" fill="#c0392b"/>
          {/* windows */}
          <rect x="20" y="13" width="16" height="12" rx="3" fill="#74b9ff" opacity="0.9"/>
          <rect x="40" y="13" width="14" height="12" rx="3" fill="#74b9ff" opacity="0.9"/>
          {/* window shine */}
          <rect x="21" y="14" width="5" height="4" rx="1" fill="white" opacity="0.5"/>
          {/* wheels */}
          <circle cx="20" cy="44" r="10" fill="#2D3436"/>
          <circle cx="60" cy="44" r="10" fill="#2D3436"/>
          <circle cx="20" cy="44" r="5" fill="#636e72"/>
          <circle cx="60" cy="44" r="5" fill="#636e72"/>
          <circle cx="20" cy="44" r="2" fill="#b2bec3"/>
          <circle cx="60" cy="44" r="2" fill="#b2bec3"/>
          {/* headlight */}
          <rect x="68" y="26" width="8" height="6" rx="2" fill="#FFD93D"/>
          {/* door line */}
          <line x1="40" y1="22" x2="40" y2="44" stroke="#c0392b" strokeWidth="1.5" opacity="0.5"/>
        </svg>
      </div>

      {/* ── BUILDING BLOCKS STACK ── */}
      <div style={{ position:'absolute', right:'4%', top:'72%', animation:'wobble 5s ease-in-out 2s infinite' }}>
        <svg width="60" height="80" viewBox="0 0 60 80">
          {/* block 3 bottom */}
          <rect x="5" y="54" width="50" height="24" rx="5" fill="#27AE60"/>
          <text x="30" y="71" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial Black">3</text>
          {/* block 2 mid */}
          <rect x="8" y="30" width="44" height="24" rx="5" fill="#E74C3C"/>
          <text x="30" y="47" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial Black">2</text>
          {/* block 1 top */}
          <rect x="12" y="6" width="36" height="24" rx="5" fill="#3498DB"/>
          <text x="30" y="23" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial Black">1</text>
          {/* shine on each */}
          <rect x="12" y="8" width="10" height="5" rx="2" fill="white" opacity="0.2"/>
          <rect x="8" y="32" width="12" height="5" rx="2" fill="white" opacity="0.2"/>
          <rect x="5" y="56" width="14" height="5" rx="2" fill="white" opacity="0.2"/>
        </svg>
      </div>

      {/* ── LOLLIPOP (improved) ── */}
      <div style={{ position:'absolute', left:'50%', top:'3%', transform:'translateX(-50%)', animation:'lollySwing 3s ease-in-out infinite' }}>
        <svg width="56" height="80" viewBox="0 0 56 80">
          {/* stick */}
          <line x1="28" y1="44" x2="28" y2="78" stroke="#dfe6e9" strokeWidth="5" strokeLinecap="round"/>
          {/* candy swirl */}
          <circle cx="28" cy="26" r="22" fill="#FF6B6B"/>
          <path d="M28 4 A22 22 0 0 1 50 26" fill="#FF922B" opacity="0.8"/>
          <path d="M50 26 A22 22 0 0 1 28 48" fill="#FFD93D" opacity="0.8"/>
          <path d="M28 48 A22 22 0 0 1 6 26" fill="#FF6B6B" opacity="0.9"/>
          <path d="M6 26 A22 22 0 0 1 28 4" fill="#fd79a8" opacity="0.8"/>
          {/* inner swirl */}
          <circle cx="28" cy="26" r="10" fill="#FF922B" opacity="0.6"/>
          <circle cx="28" cy="26" r="4" fill="#FFD93D"/>
          {/* shine */}
          <circle cx="20" cy="18" r="5" fill="white" opacity="0.25"/>
        </svg>
      </div>

      {/* ── STAR (sparkly) ── */}
      <div style={{ position:'absolute', left:'8%', top:'90%', animation:'sparkle 2s ease-in-out 0.8s infinite' }}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <polygon points="24,2 29,17 44,17 32,27 37,42 24,33 11,42 16,27 4,17 19,17" fill="#FFD93D" stroke="#f39c12" strokeWidth="1.5"/>
          {/* sparkle lines */}
          <line x1="24" y1="0" x2="24" y2="4" stroke="#FFD93D" strokeWidth="2" opacity="0.6"/>
          <line x1="44" y1="10" x2="41" y2="13" stroke="#FFD93D" strokeWidth="2" opacity="0.6"/>
          <line x1="4" y1="10" x2="7" y2="13" stroke="#FFD93D" strokeWidth="2" opacity="0.6"/>
          <circle cx="24" cy="22" r="5" fill="#fff" opacity="0.3"/>
        </svg>
      </div>

      {/* ── TEDDY BEAR (improved) ── */}
      <div style={{ position:'absolute', right:'7%', top:'88%', animation:'bearBreathe 4s ease-in-out 1s infinite' }}>
        <svg width="70" height="80" viewBox="0 0 70 80">
          {/* body */}
          <ellipse cx="35" cy="60" rx="22" ry="18" fill="#D4A017"/>
          {/* tummy */}
          <ellipse cx="35" cy="62" rx="14" ry="12" fill="#f0c040" opacity="0.6"/>
          {/* arms */}
          <ellipse cx="14" cy="56" rx="8" ry="13" fill="#D4A017" transform="rotate(-15,14,56)"/>
          <ellipse cx="56" cy="56" rx="8" ry="13" fill="#D4A017" transform="rotate(15,56,56)"/>
          {/* legs */}
          <ellipse cx="24" cy="75" rx="9" ry="7" fill="#D4A017"/>
          <ellipse cx="46" cy="75" rx="9" ry="7" fill="#D4A017"/>
          {/* ears */}
          <circle cx="18" cy="16" r="10" fill="#D4A017"/>
          <circle cx="52" cy="16" r="10" fill="#D4A017"/>
          <circle cx="18" cy="16" r="6" fill="#e8b84b"/>
          <circle cx="52" cy="16" r="6" fill="#e8b84b"/>
          {/* head */}
          <circle cx="35" cy="30" r="22" fill="#D4A017"/>
          {/* muzzle */}
          <ellipse cx="35" cy="36" rx="10" ry="7" fill="#e8b84b"/>
          {/* eyes */}
          <circle cx="27" cy="24" r="4" fill="#2D3436"/>
          <circle cx="43" cy="24" r="4" fill="#2D3436"/>
          <circle cx="28.5" cy="22.5" r="1.5" fill="white"/>
          <circle cx="44.5" cy="22.5" r="1.5" fill="white"/>
          {/* nose */}
          <ellipse cx="35" cy="32" rx="4" ry="2.5" fill="#2D3436"/>
          {/* smile */}
          <path d="M29 36 Q35 42 41 36" stroke="#2D3436" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* blush */}
          <circle cx="22" cy="30" r="5" fill="#ff7675" opacity="0.35"/>
          <circle cx="48" cy="30" r="5" fill="#ff7675" opacity="0.35"/>
          {/* bow tie */}
          <polygon points="29,46 35,50 29,54" fill="#E74C3C"/>
          <polygon points="41,46 35,50 41,54" fill="#E74C3C"/>
          <circle cx="35" cy="50" r="3" fill="#c0392b"/>
        </svg>
      </div>

      <style>{`
        @keyframes wobble {
          0%,100% { transform: rotate(-4deg) translateY(0px); }
          25%      { transform: rotate(4deg) translateY(-8px); }
          50%      { transform: rotate(-2deg) translateY(-14px); }
          75%      { transform: rotate(3deg) translateY(-6px); }
        }
        @keyframes crayonWiggle {
          0%,100% { transform: rotate(-8deg) translateY(0px); }
          30%      { transform: rotate(8deg) translateY(-10px); }
          60%      { transform: rotate(-5deg) translateY(-16px); }
        }
        @keyframes duckBob {
          0%,100% { transform: translateY(0px) rotate(-5deg); }
          40%      { transform: translateY(-12px) rotate(5deg); }
          70%      { transform: translateY(-6px) rotate(-3deg); }
        }
        @keyframes carDrive {
          0%,100% { transform: translateX(0px) rotate(0deg); }
          50%      { transform: translateX(-10px) rotate(-2deg); }
        }
        @keyframes yoyo {
          0%,100% { transform: translateY(0px) scaleY(1); }
          40%      { transform: translateY(20px) scaleY(0.9); }
          60%      { transform: translateY(24px) scaleY(0.85); }
        }
        @keyframes lollySwing {
          0%,100% { transform: translateX(-50%) rotate(-8deg); }
          50%      { transform: translateX(-50%) rotate(8deg); }
        }
        @keyframes sparkle {
          0%,100% { transform: scale(1) rotate(0deg); opacity:0.8; }
          50%      { transform: scale(1.15) rotate(20deg); opacity:1; }
        }
        @keyframes bearBreathe {
          0%,100% { transform: scale(1) translateY(0px); }
          50%      { transform: scale(1.04) translateY(-6px); }
        }
        @keyframes toySpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  )
}

const timeline = [
  {
    year: '2025 — now',
    type: 'education',
    title: 'Learning Unity Animations & Linux',
    place: 'Self-taught · Currently exploring',
    description: 'Diving into Unity animation systems and picking up Linux on the side. Always something new to learn.',
    tags: ['Unity Animations', 'Linux', 'C#'],
    icon: '⚡',
    active: true,
  },
  {
    year: '2024 — now',
    type: 'education',
    title: 'B.E. Computer Science',
    place: 'KDK College of Engineering, Nagpur',
    description: 'First year. Learning the fundamentals while building things on the side that actually interest me.',
    tags: ['C', 'Python', 'Data Structures', 'DBMS'],
    icon: '🎓',
    active: true,
  },
  {
    year: 'Dec 2024',
    type: 'project',
    title: 'Started Game Development',
    place: 'Self-taught · Unity & C#',
    description: 'Finally made it real. Picked up Unity and C# and started shipping games — Neon Dash, BoXeS, UFO Adventures. The dream from lockdown became actual code.',
    tags: ['Unity', 'C#', 'URP', 'Game Design'],
    icon: '🎮',
    active: false,
  },
  {
    year: 'Oct 2024',
    type: 'project',
    title: 'Started Web Development',
    place: 'Self-taught · React & Next.js',
    description: 'Moved into web dev. Built dashboards, timers, and eventually this portfolio — which has a working PC you can disassemble.',
    tags: ['React', 'Next.js', 'TypeScript', 'Three.js'],
    icon: '🌐',
    active: false,
  },
  {
    year: '2024',
    type: 'project',
    title: 'First Lines of Code',
    place: 'Self-taught · Python',
    description: 'Wrote my first real code in Python. Built Jarvis — a speech recognition assistant that opens websites and searches online. Thought I was Tony Stark.',
    tags: ['Python', 'SpeechRecognition', 'Pygame'],
    icon: '🐍',
    active: false,
  },
  {
    year: '2020 — Lockdown',
    type: 'origin',
    title: 'The Spark',
    place: 'Home · Playing video games',
    description: 'Spent lockdown playing games and wondering — how do people make these? That question never left. Four years later, here we are.',
    tags: ['Video Games', 'Curiosity', 'The Beginning'],
    icon: '🕹️',
    active: false,
  },
]

const TYPE_COLOR: Record<string, string> = {
  education: '#4A9B7F',
  project:   '#9DB89A',
  origin:    '#C4CDB8',
}

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
            setTimeout(() => {
              (el as HTMLElement).style.opacity = '1'
              ;(el as HTMLElement).style.transform = 'translateY(0)'
            }, i * 100)
          })
        }
      })
    }, { threshold: 0.05 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="experience" ref={sectionRef} style={{
      padding: '8rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      background: '#241E21',
    }}>
      {/* Floating toys background */}
      <FloatingToys />

      {/* Subtle top fade */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, rgba(36,30,33,0.8), transparent)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.7s ease', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #4A9B7F, #9DB89A)' }} />
            <span style={{ color: '#9DB89A', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Journey</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#C4CDB8', margin: 0, marginBottom: '0.5rem' }}>
            How I got{' '}
            <span style={{ background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              here.
            </span>
          </h2>
          <p style={{ color: '#9DB89A', fontSize: '0.9rem', opacity: 0.7, margin: 0 }}>
            No internships yet — just a first-year building things because it's fun.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>

          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 19, top: 0, bottom: 0,
            width: 1,
            background: 'linear-gradient(to bottom, #4A9B7F, rgba(74,155,127,0.1))',
          }} />

          {timeline.map((item, i) => (
            <div
              key={i}
              className="fade-up"
              style={{
                opacity: 0, transform: 'translateY(24px)',
                transition: `all 0.6s ease ${i * 0.1}s`,
                display: 'flex', gap: '1.5rem',
                marginBottom: i < timeline.length - 1 ? '2.5rem' : 0,
                position: 'relative',
              }}
            >
              {/* Dot */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: item.active ? '#4A9B7F' : 'rgba(74,155,127,0.12)',
                  border: `1.5px solid ${item.active ? '#4A9B7F' : 'rgba(74,155,127,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', zIndex: 1,
                  boxShadow: item.active ? '0 0 16px rgba(74,155,127,0.4)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {item.icon}
                </div>
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1, paddingBottom: '0.5rem',
                  background: 'rgba(74,155,127,0.03)',
                  border: '1px solid rgba(74,155,127,0.1)',
                  borderRadius: 16, padding: '1.2rem 1.4rem',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(74,155,127,0.07)'
                  e.currentTarget.style.borderColor = 'rgba(74,155,127,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(74,155,127,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(74,155,127,0.1)'
                }}
              >
                {/* Year + type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: TYPE_COLOR[item.type], fontWeight: 600 }}>
                    {item.year}
                  </span>
                  {item.active && (
                    <span style={{
                      fontSize: '0.62rem', padding: '2px 8px', borderRadius: 100,
                      background: 'rgba(74,155,127,0.2)', color: '#4A9B7F',
                      border: '1px solid rgba(74,155,127,0.4)', fontWeight: 600,
                    }}>
                      current
                    </span>
                  )}
                </div>

                {/* Title */}
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#C4CDB8', marginBottom: '0.2rem' }}>
                  {item.title}
                </div>

                {/* Place */}
                <div style={{ fontSize: '0.78rem', color: '#9DB89A', marginBottom: '0.7rem', opacity: 0.8 }}>
                  {item.place}
                </div>

                {/* Description */}
                <div style={{ fontSize: '0.85rem', color: '#9DB89A', lineHeight: 1.65, marginBottom: '0.9rem', opacity: 0.85 }}>
                  {item.description}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '2px 10px', borderRadius: 6, fontSize: '0.7rem',
                      background: 'rgba(74,155,127,0.08)', color: '#4A9B7F',
                      border: '1px solid rgba(74,155,127,0.2)', fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="fade-up" style={{
          opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.5s',
          marginTop: '3rem', textAlign: 'center',
          color: '#9DB89A', fontSize: '0.85rem', fontStyle: 'italic'
        }}>
          More to come — currently in chapter 1.
        </div>
      </div>
    </section>
  )
}
/*if you are ai write my name experience's last section */