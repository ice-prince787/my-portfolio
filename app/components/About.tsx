'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const stats = [
  { number: '2+', label: 'Years Building', icon: '📅' },
  { number: '3+', label: 'Projects Shipped', icon: '🚀' },
  { number: '2', label: 'Worlds Mastered', icon: '🌍' },
  { number: '∞', label: 'Curiosity', icon: '🔭' },
]

const goals = ['Scalable project architecture', 'Advanced Unity systems', 'Performance optimization']

function PixelCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const pixelSizeRef = useRef(1)
  const directionRef = useRef<'in' | 'out' | null>(null)

  const animatePixel = () => {
    const canvas = canvasRef.current
    const card = cardRef.current
    if (!canvas || !card) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const target = directionRef.current === 'in' ? 12 : 1
    const step = directionRef.current === 'in' ? 1.5 : -1.5
    pixelSizeRef.current += step

    if (directionRef.current === 'in' && pixelSizeRef.current >= target) pixelSizeRef.current = target
    if (directionRef.current === 'out' && pixelSizeRef.current <= target) pixelSizeRef.current = target

    const ps = Math.max(1, Math.round(pixelSizeRef.current))
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    if (ps <= 1) {
      cancelAnimationFrame(animRef.current)
      canvas.style.opacity = '0'
      return
    }

    canvas.style.opacity = '1'

    // Draw pixelated green grid overlay
    for (let y = 0; y < h; y += ps) {
      for (let x = 0; x < w; x += ps) {
        const brightness = 0.03 + Math.random() * 0.06
        ctx.fillStyle = `rgba(74,155,127,${brightness})`
        ctx.fillRect(x, y, ps - 1, ps - 1)
      }
    }

    // Draw pixel border glow
    ctx.strokeStyle = `rgba(74,155,127,${0.2 + (ps / 12) * 0.5})`
    ctx.lineWidth = ps / 3
    ctx.strokeRect(ps, ps, w - ps * 2, h - ps * 2)

    if (
      (directionRef.current === 'in' && pixelSizeRef.current < target) ||
      (directionRef.current === 'out' && pixelSizeRef.current > target)
    ) {
      animRef.current = requestAnimationFrame(animatePixel)
    }
  }

  const handleMouseEnter = () => {
    directionRef.current = 'in'
    cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(animatePixel)
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'rgba(74,155,127,0.7)'
      cardRef.current.style.boxShadow = '0 0 30px rgba(74,155,127,0.25)'
    }
  }

  const handleMouseLeave = () => {
    directionRef.current = 'out'
    cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(animatePixel)
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'rgba(74,155,127,0.25)'
      cardRef.current.style.boxShadow = '0 8px 32px rgba(74,155,127,0.1)'
    }
  }

  return (
    <div
      ref={cardRef}
      className="fade-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: 0,
        background: 'rgba(74,155,127,0.08)',
        border: '1px solid rgba(74,155,127,0.25)',
        borderRadius: '20px', padding: '1.5rem',
        textAlign: 'center',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'default',
        boxShadow: '0 8px 32px rgba(74,155,127,0.1)',
        position: 'relative', zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.1s',
          borderRadius: '20px',
        }}
      />
      {children}
    </div>
  )
}

function CubesBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    mount.appendChild(renderer.domElement)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    type TrailPoint = { mesh: THREE.Mesh; life: number }
    type CubeData = {
      mesh: THREE.Mesh
      vel: THREE.Vector3
      rotVel: THREE.Vector3
      floatOffset: number
      floatSpeed: number
      isDragging: boolean
      dragPlane: THREE.Plane
      trail: TrailPoint[]
      radius: number
    }

    const cubes: CubeData[] = []
    const colors = [0x4A9B7F, 0x9DB89A, 0xC4CDB8, 0x2D4F47, 0x4A9B7F, 0x2D4F47, 0xa855f7, 0xec4899]

    const geoOptions = [
      () => new THREE.BoxGeometry(0.6, 0.6, 0.6),
      () => new THREE.BoxGeometry(0.85, 0.85, 0.85),
      () => new THREE.BoxGeometry(0.45, 0.45, 0.45),
      () => new THREE.OctahedronGeometry(0.42),
      () => new THREE.OctahedronGeometry(0.58),
      () => new THREE.IcosahedronGeometry(0.38),
      () => new THREE.IcosahedronGeometry(0.55),
      () => new THREE.TetrahedronGeometry(0.5),
    ]

    const edgesGroup = new THREE.Group()
    scene.add(edgesGroup)

    for (let i = 0; i < 28; i++) {
      const geoFn = geoOptions[Math.floor(Math.random() * geoOptions.length)]
      const geo = geoFn()
      const color = colors[Math.floor(Math.random() * colors.length)]
      const isWire = Math.random() > 0.5

      // Main mesh
      const mat = new THREE.MeshPhongMaterial({
  color,
  transparent: true,
  opacity: isWire ? 0.0 : 0.6,
  wireframe: false,
  shininess: 120,
  specular: new THREE.Color(0xffffff),
})
const mesh = new THREE.Mesh(geo, mat)

// Edge lines on ALL shapes — bright and glowing
const edges = new THREE.EdgesGeometry(geo)
const lineMat = new THREE.LineBasicMaterial({
  color: isWire ? color : color,
  transparent: true,
  opacity: isWire ? 1.0 : 0.85,
})
const edgeMesh = new THREE.LineSegments(edges, lineMat)
mesh.add(edgeMesh)

// Add a second slightly scaled glow layer for wireframe ones
if (isWire) {
  const glowGeo = geo.clone()
  const glowEdges = new THREE.EdgesGeometry(glowGeo)
  const glowMat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.3,
  })
  const glowMesh = new THREE.LineSegments(glowEdges, glowMat)
  glowMesh.scale.setScalar(1.08)
  mesh.add(glowMesh)
}

      const x = (Math.random() - 0.5) * 18
      const y = (Math.random() - 0.5) * 11
      const z = (Math.random() - 0.5) * 3
      mesh.position.set(x, y, z)
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      mesh.castShadow = true
      scene.add(mesh)

      // Bounding radius for collision
      const bbox = new THREE.Box3().setFromObject(mesh)
      const size = new THREE.Vector3()
      bbox.getSize(size)
      const radius = size.length() / 2

      cubes.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          0
        ),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.008
        ),
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.15 + Math.random() * 0.35,
        isDragging: false,
        dragPlane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
        trail: [],
        radius,
      })
    }

    // Trail material pool
    const makeTrailMesh = (color: THREE.Color) => {
      const geo = new THREE.SphereGeometry(0.06, 6, 6)
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.8,
      })
      return new THREE.Mesh(geo, mat)
    }

    let draggedCube: CubeData | null = null
    const dragOffset = new THREE.Vector3()
    const intersectPoint = new THREE.Vector3()
    const prevMouse = new THREE.Vector2()
    const mouseDelta = new THREE.Vector2()

    const getMouseVec = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    const onSectionMouseMove = (e: MouseEvent) => {
      getMouseVec(e)
      mouseDelta.copy(mouse).sub(prevMouse)
      prevMouse.copy(mouse)

      raycaster.setFromCamera(mouse, camera)

      if (draggedCube) {
        raycaster.ray.intersectPlane(draggedCube.dragPlane, intersectPoint)
        draggedCube.mesh.position.copy(intersectPoint.add(dragOffset))
        draggedCube.vel.set(mouseDelta.x * 5, mouseDelta.y * 5, 0)

        // Spawn trail
        const mat = draggedCube.mesh.material as THREE.MeshPhongMaterial
        const trailMesh = makeTrailMesh(mat.color)
        trailMesh.position.copy(draggedCube.mesh.position)
        scene.add(trailMesh)
        draggedCube.trail.push({ mesh: trailMesh, life: 1.0 })
        if (draggedCube.trail.length > 18) {
          const old = draggedCube.trail.shift()!
          scene.remove(old.mesh)
        }
      } else {
        const hits = raycaster.intersectObjects(cubes.map(c => c.mesh), true)
        if (hits.length > 0) {
          renderer.domElement.style.pointerEvents = 'auto'
          renderer.domElement.style.cursor = 'grab'
        } else {
          renderer.domElement.style.pointerEvents = 'none'
          renderer.domElement.style.cursor = 'default'
        }
      }
    }

    const onSectionMouseDown = (e: MouseEvent) => {
      getMouseVec(e)
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(cubes.map(c => c.mesh), true)
      if (hits.length > 0) {
        const hitObj = hits[0].object
        draggedCube = cubes.find(c => c.mesh === hitObj || c.mesh.children.includes(hitObj)) || null
        if (draggedCube) {
          draggedCube.isDragging = true
          draggedCube.vel.set(0, 0, 0)
          draggedCube.dragPlane.constant = -draggedCube.mesh.position.z
          raycaster.ray.intersectPlane(draggedCube.dragPlane, intersectPoint)
          dragOffset.copy(draggedCube.mesh.position).sub(intersectPoint)
          renderer.domElement.style.cursor = 'grabbing'
        }
      }
    }

    const onMouseUp = () => {
      if (draggedCube) {
        draggedCube.isDragging = false
        draggedCube = null
      }
      renderer.domElement.style.cursor = 'default'
    }

    const section = mount.parentElement!
    section.addEventListener('mousemove', onSectionMouseMove)
    section.addEventListener('mousedown', onSectionMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const pl1 = new THREE.PointLight(0x4A9B7F, 6, 30)
pl1.position.set(5, 5, 6)
scene.add(pl1)
const pl2 = new THREE.PointLight(0x9DB89A, 6, 30)
pl2.position.set(-5, -4, 5)
scene.add(pl2)
const pl3 = new THREE.PointLight(0xC4CDB8, 3, 20)
pl3.position.set(0, 0, 8)
scene.add(pl3)
const pl4 = new THREE.PointLight(0xffffff, 2, 25)
pl4.position.set(0, 5, 6)
scene.add(pl4)

    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let frameId: number
    const BOUNDS = { x: 10, y: 7 }

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Update cubes
      for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i]

        if (!c.isDragging) {
          c.mesh.rotation.x += c.rotVel.x
          c.mesh.rotation.y += c.rotVel.y
          c.mesh.rotation.z += c.rotVel.z
          c.mesh.position.x += c.vel.x
          c.mesh.position.y += c.vel.y + Math.sin(t * c.floatSpeed + c.floatOffset) * 0.003
          c.vel.x *= 0.99
          c.vel.y *= 0.99

          // Wrap
          if (c.mesh.position.x > BOUNDS.x) c.mesh.position.x = -BOUNDS.x
          if (c.mesh.position.x < -BOUNDS.x) c.mesh.position.x = BOUNDS.x
          if (c.mesh.position.y > BOUNDS.y) c.mesh.position.y = -BOUNDS.y
          if (c.mesh.position.y < -BOUNDS.y) c.mesh.position.y = BOUNDS.y
        }

        // Cube vs cube bouncing
        for (let j = i + 1; j < cubes.length; j++) {
          const c2 = cubes[j]
          const diff = new THREE.Vector3().subVectors(c.mesh.position, c2.mesh.position)
          const dist = diff.length()
          const minDist = c.radius + c2.radius

          if (dist < minDist && dist > 0) {
            const normal = diff.normalize()
            const overlap = minDist - dist

            // Push apart
            c.mesh.position.addScaledVector(normal, overlap * 0.5)
            c2.mesh.position.addScaledVector(normal, -overlap * 0.5)

            // Exchange velocity along normal
            const relVel = new THREE.Vector3().subVectors(c.vel, c2.vel)
            const speed = relVel.dot(normal)
            if (speed < 0) {
              const impulse = normal.clone().multiplyScalar(speed * 0.85)
              c.vel.sub(impulse)
              c2.vel.add(impulse)
              // Spin more on impact
              c.rotVel.x += (Math.random() - 0.5) * 0.02
              c.rotVel.y += (Math.random() - 0.5) * 0.02
              c2.rotVel.x += (Math.random() - 0.5) * 0.02
              c2.rotVel.y += (Math.random() - 0.5) * 0.02
            }
          }
        }

        // Fade trail
        c.trail.forEach((tp, ti) => {
          tp.life -= 0.045
          const mat = tp.mesh.material as THREE.MeshBasicMaterial
          mat.opacity = Math.max(0, tp.life * 0.8)
          const s = Math.max(0.01, tp.life)
          tp.mesh.scale.setScalar(s)
          if (tp.life <= 0) {
            scene.remove(tp.mesh)
            c.trail.splice(ti, 1)
          }
        })
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      section.removeEventListener('mousemove', onSectionMouseMove)
      section.removeEventListener('mousedown', onSectionMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} style={{
      position: 'absolute', top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: 0, overflow: 'hidden',
      pointerEvents: 'none',
    }} />
  )
}

export default function About() {
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
              }, i * 120)
            })
          }
        })
      }, { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about"  ref={sectionRef} style={{
      padding: '8rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
    }}>
      {/* 3D cubes only in this section */}
      <CubesBackground />

      {/* All content above cubes */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2, userSelect: 'none' }}>

        {/* Section label */}
        <div className="fade-in" style={{
          opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
          display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'
        }}>
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #4A9B7F, #9DB89A)' }} />
          <span style={{ color: '#9DB89A', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>About Me</span>
        </div>

        {/* Heading */}
        <h2 className="fade-in" style={{
          opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
          marginBottom: '3rem', color: '#C4CDB8'
        }}>
          I make things<br />
          <span style={{
            background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>that move.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

          {/* Left — text */}
          <div>
            {[
              "Sometimes it's a neon runner speeding through a synthwave city. Sometimes it's a React interface gliding with smooth animations. I'm a student and developer living at the intersection of game development and modern web development.",
              "What excites me most is understanding how things work under the hood — how movement feels smooth, how UI flows naturally, how architecture stays clean even as complexity grows.",
              "I learn by building. I build consistently."
            ].map((text, i) => (
              <p key={i} className="fade-in" style={{
                opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
                lineHeight: 1.8, fontSize: '1.05rem',
                marginBottom: '1.2rem',
                fontStyle: i === 2 ? 'italic' : 'normal',
                fontWeight: i === 2 ? 600 : 400,
                color: i === 2 ? '#C4CDB8' : '#9DB89A',
              }}>
                {text}
              </p>
            ))}

            <div className="fade-in" style={{
              opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
              display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.8rem'
            }}>
              {['Game Dev', 'Web Dev', 'Unity', 'React', 'Anime.js', 'Clean Architecture', 'Always Learning'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(74,155,127,0.15)',
                  border: '1px solid rgba(74,155,127,0.35)',
                  color: '#4A9B7F', borderRadius: '100px',
                  padding: '0.3rem 0.9rem', fontSize: '0.82rem', fontWeight: 500,
                  transition: 'all 0.2s', cursor: 'default'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(157,184,154,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(157,184,154,0.5)'
                    e.currentTarget.style.color = '#9DB89A'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(74,155,127,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(74,155,127,0.35)'
                    e.currentTarget.style.color = '#4A9B7F'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — avatar + cards */}
          <div>
            <div className="fade-in" style={{
              opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s ease',
              width: '150px', height: '150px',
              margin: '0 auto 1.5rem',
            }}>
              <canvas
                width={120}
                height={120}
                ref={el => {
                  if (!el) return
                  const T = require('three')
                  const scene = new T.Scene()
                  const camera = new T.PerspectiveCamera(45, 1, 0.1, 100)
                  camera.position.z = 4
                  const renderer = new T.WebGLRenderer({ canvas: el, antialias: true, alpha: true })
                  renderer.setSize(150, 150)
                  renderer.setClearColor(0x000000, 0)

                  const bodyGeo = new T.BoxGeometry(1.6, 0.18, 1.6)
                  const bodyMat = new T.MeshStandardMaterial({ color: 0x2D4F47, metalness: 0.8, roughness: 0.2 })
                  const body = new T.Mesh(bodyGeo, bodyMat)
                  scene.add(body)

                  const topGeo = new T.BoxGeometry(1.4, 0.02, 1.4)
                  const topMat = new T.MeshStandardMaterial({ color: 0x4A9B7F, metalness: 0.9, roughness: 0.1, emissive: new T.Color(0x4A9B7F), emissiveIntensity: 0.4 })
                  const top = new T.Mesh(topGeo, topMat)
                  top.position.y = 0.1
                  body.add(top)

                  const lineMat = new T.LineBasicMaterial({ color: 0x9DB89A, transparent: true, opacity: 0.8 })
                  const linePositions = [
                    [-0.5, 0, -0.5, 0.5, 0, -0.5],
                    [-0.5, 0, 0, 0.5, 0, 0],
                    [-0.5, 0, 0.5, 0.5, 0, 0.5],
                    [-0.3, 0, -0.6, -0.3, 0, 0.6],
                    [0.3, 0, -0.6, 0.3, 0, 0.6],
                  ]
                  linePositions.forEach(pts => {
                    const geo = new T.BufferGeometry().setFromPoints([
                      new T.Vector3(pts[0], pts[1] + 0.12, pts[2]),
                      new T.Vector3(pts[3], pts[4] + 0.12, pts[5]),
                    ])
                    body.add(new T.Line(geo, lineMat))
                  })

                  const pinMat = new T.MeshStandardMaterial({ color: 0x9DB89A, metalness: 1, roughness: 0.1 })
                  const pinGeo = new T.BoxGeometry(0.04, 0.04, 0.12)
                  for (let side = 0; side < 4; side++) {
                    for (let p = -3; p <= 3; p++) {
                      const pin = new T.Mesh(pinGeo, pinMat)
                      if (side === 0) pin.position.set(p * 0.22, -0.05, 0.88)
                      else if (side === 1) pin.position.set(p * 0.22, -0.05, -0.88)
                      else if (side === 2) { pin.rotation.y = Math.PI / 2; pin.position.set(0.88, -0.05, p * 0.22) }
                      else { pin.rotation.y = Math.PI / 2; pin.position.set(-0.88, -0.05, p * 0.22) }
                      body.add(pin)
                    }
                  }

                  body.add(new T.LineSegments(new T.EdgesGeometry(bodyGeo), new T.LineBasicMaterial({ color: 0x4A9B7F, transparent: true, opacity: 0.6 })))

                  scene.add(new T.AmbientLight(0xffffff, 0.5))
                  const pl = new T.PointLight(0x4A9B7F, 4, 10)
                  pl.position.set(3, 3, 3)
                  scene.add(pl)
                  const pl2 = new T.PointLight(0x9DB89A, 2, 8)
                  pl2.position.set(-3, -2, 2)
                  scene.add(pl2)

                  let isDragging = false
                  let prevX = 0, prevY = 0
                  let velX = 0, velY = 0
                  // Set initial cool diagonal tilt
                  body.rotation.x = 0.55
                  body.rotation.y = 0.4

                  el.addEventListener('mousedown', e => { isDragging = true; prevX = e.clientX; prevY = e.clientY; el.style.cursor = 'grabbing' })
                  window.addEventListener('mousemove', e => {
                    if (!isDragging) return
                    velY = (e.clientX - prevX) * 0.018
                    velX = (e.clientY - prevY) * 0.018
                    prevX = e.clientX; prevY = e.clientY
                  })
                  window.addEventListener('mouseup', () => { isDragging = false; el.style.cursor = 'grab' })
                  el.style.cursor = 'grab'

                  const animate = () => {
                    requestAnimationFrame(animate)
                    body.rotation.y += velY
                    body.rotation.x += velX
                    if (!isDragging) {
                      // Slow friction — velocity dies smoothly
                      velY *= 0.92
                      velX *= 0.92
                      // Slow constant Y spin — like Apple product showcase
                      velY += 0.003
                      // Gently ease X back to the cool tilt so top face stays visible
                      body.rotation.x += (0.55 - body.rotation.x) * 0.015
                    }
                    renderer.render(scene, camera)
                  }
                  animate()
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {stats.map((stat, i) => (
                <PixelCard key={i}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{stat.icon}</div>
                  <div style={{
                    fontSize: '1.8rem', fontWeight: 800,
                    background: 'linear-gradient(135deg, #4A9B7F, #9DB89A)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{ color: '#9DB89A', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                    {stat.label}
                  </div>
                </PixelCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatAvatar {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  )
}