'use client'
import { useEffect, useRef } from 'react'

const skillCategories = [
  {
    title: 'Web Development',
    icon: '🌐',
    color: '#4A9B7F',
    skills: [
      { name: 'HTML',       level: 90 },
      { name: 'CSS',        level: 85 },
      { name: 'JavaScript', level: 80 },
      { name: 'React',      level: 75 },
      { name: 'JSX',        level: 75 },
      { name: 'Anime.js',   level: 70 },
    ]
  },
  {
    title: 'Game Development',
    icon: '🎮',
    color: '#9DB89A',
    skills: [
      { name: 'Unity (URP)',         level: 80 },
      { name: 'C#',                  level: 75 },
      { name: 'Python',              level: 70 },
      { name: 'Pygame',              level: 70 },
      { name: 'Game Architecture',   level: 72 },
      { name: 'Movement Systems',    level: 78 },
    ]
  },
  {
    title: 'Tools & Workflow',
    icon: '🛠',
    color: '#C4CDB8',
    skills: [
      { name: 'Git',          level: 65 },
      { name: 'VS Code',      level: 90 },
      { name: 'Unity Editor', level: 80 },
      { name: 'Figma',        level: 60 },
    ]
  },
]

function SkillBar({ name, level, color, index }: {
  name: string; level: number; color: string; index: number
}) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (barRef.current) {
                barRef.current.style.width = `${level}%`
              }
            }, index * 80)
          }
        })
      },
      { threshold: 0.3 }
    )
    if (barRef.current) observer.observe(barRef.current.parentElement!)
    return () => observer.disconnect()
  }, [level, index])

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: '0.4rem',
      }}>
        <span style={{ color: '#C4CDB8', fontSize: '0.9rem', fontWeight: 500 }}>{name}</span>
        <span style={{ color: color, fontSize: '0.85rem', fontWeight: 700 }}>{level}%</span>
      </div>
      <div style={{
        height: '6px', borderRadius: '100px',
        background: 'rgba(74,155,127,0.15)',
        overflow: 'hidden',
      }}>
        <div
          ref={barRef}
          style={{
            height: '100%', width: '0%',
            borderRadius: '100px',
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-in').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1'
                ;(el as HTMLElement).style.transform = 'translateY(0)'
              }, i * 100)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} style={{
      padding: '8rem 2rem',
      maxWidth: '1100px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Section label */}
      <div className="fade-in" style={{
        opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
        display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'
      }}>
        <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #4A9B7F, #9DB89A)' }} />
        <span style={{ color: '#9DB89A', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Skills
        </span>
      </div>

      {/* Heading */}
      <h2 className="fade-in" style={{
        opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
        fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
        marginBottom: '3.5rem', color: '#C4CDB8'
      }}>
        What I work with<br />
        <span style={{
          background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>every day.</span>
      </h2>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
      }}>
        {skillCategories.map((cat, ci) => (
          <div
            key={ci}
            className="fade-in"
           style={{
                   opacity: 0, transform: 'translateY(30px)',
                   background: 'rgba(74,155,127,0.06)',
                   border: `1px solid ${cat.color}33`,
                   borderRadius: '24px',
                   padding: '1.8rem',
                   transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s',
                }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${cat.color}88`
              e.currentTarget.style.boxShadow = `0 8px 40px ${cat.color}22`
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${cat.color}33`
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Card header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${cat.color}22`,
                border: `1px solid ${cat.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
              }}>
                {cat.icon}
              </div>
              <h3 style={{
                color: '#C4CDB8', fontWeight: 700, fontSize: '1rem',
                lineHeight: 1.2,
              }}>
                {cat.title}
              </h3>
            </div>

            {/* Skill bars */}
            {cat.skills.map((skill, si) => (
              <SkillBar
                key={si}
                name={skill.name}
                level={skill.level}
                color={cat.color}
                index={si}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className="fade-in" style={{
        opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
        textAlign: 'center', marginTop: '3rem',
        color: '#9DB89A', fontSize: '0.9rem',
        fontStyle: 'italic',
      }}>
        Always learning — always building 🚀
      </div>
    </section>
  )
}