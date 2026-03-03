'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function FloatingCubes() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.pointerEvents = 'auto'

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    type CubeData = {
      mesh: THREE.Mesh
      vel: THREE.Vector3
      rotVel: THREE.Vector3
      floatOffset: number
      floatSpeed: number
      isDragging: boolean
      dragPlane: THREE.Plane
    }

    const cubes: CubeData[] = []
    const colors = [0x4A9B7F, 0x9DB89A, 0xC4CDB8, 0x2D4F47, 0x4A9B7F, 0x2D4F47]

    const geoOptions = [
      () => new THREE.BoxGeometry(0.55, 0.55, 0.55),
      () => new THREE.BoxGeometry(0.75, 0.75, 0.75),
      () => new THREE.BoxGeometry(0.4, 0.4, 0.4),
      () => new THREE.OctahedronGeometry(0.38),
      () => new THREE.OctahedronGeometry(0.52),
    ]

    for (let i = 0; i < 20; i++) {
      const geo = geoOptions[Math.floor(Math.random() * geoOptions.length)]()
      const isWire = Math.random() > 0.55
      const mat = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        metalness: 0.4,
        roughness: 0.3,
        transparent: true,
        opacity: isWire ? 0.5 : 0.75,
        wireframe: isWire,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 3
      )
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      scene.add(mesh)

      cubes.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          0
        ),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.007
        ),
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.2 + Math.random() * 0.4,
        isDragging: false,
        dragPlane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      })
    }

    // Drag state
    let draggedCube: CubeData | null = null
    const dragOffset = new THREE.Vector3()
    const intersectPoint = new THREE.Vector3()

    const getMouseVec = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    const onMouseDown = (e: MouseEvent) => {
      getMouseVec(e)
      raycaster.setFromCamera(mouse, camera)
      const meshes = cubes.map(c => c.mesh)
      const hits = raycaster.intersectObjects(meshes)
      if (hits.length > 0) {
        const hit = hits[0]
        draggedCube = cubes.find(c => c.mesh === hit.object) || null
        if (draggedCube) {
          draggedCube.isDragging = true
          draggedCube.vel.set(0, 0, 0)
          // Set drag plane at cube's z depth
          draggedCube.dragPlane.constant = -draggedCube.mesh.position.z
          raycaster.ray.intersectPlane(draggedCube.dragPlane, intersectPoint)
          dragOffset.copy(draggedCube.mesh.position).sub(intersectPoint)
          renderer.domElement.style.cursor = 'grabbing'
        }
      }
    }

    const prevMouse = new THREE.Vector2()
    const mouseDelta = new THREE.Vector2()

    const onMouseMove = (e: MouseEvent) => {
      getMouseVec(e)
      mouseDelta.copy(mouse).sub(prevMouse)
      prevMouse.copy(mouse)

      if (draggedCube) {
        raycaster.setFromCamera(mouse, camera)
        raycaster.ray.intersectPlane(draggedCube.dragPlane, intersectPoint)
        draggedCube.mesh.position.copy(intersectPoint.add(dragOffset))
        // Give velocity based on mouse movement for throw effect
        draggedCube.vel.set(mouseDelta.x * 4, mouseDelta.y * 4, 0)
      } else {
        // Cursor hint
        raycaster.setFromCamera(mouse, camera)
        const hits = raycaster.intersectObjects(cubes.map(c => c.mesh))
        renderer.domElement.style.cursor = hits.length > 0 ? 'grab' : 'default'
      }
    }

    const onMouseUp = () => {
      if (draggedCube) {
        draggedCube.isDragging = false
        draggedCube = null
      }
      renderer.domElement.style.cursor = 'default'
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const pl1 = new THREE.PointLight(0x4A9B7F, 3, 25)
    pl1.position.set(4, 4, 5)
    scene.add(pl1)
    const pl2 = new THREE.PointLight(0x9DB89A, 3, 25)
    pl2.position.set(-4, -3, 4)
    scene.add(pl2)
    const pl3 = new THREE.PointLight(0xC4CDB8, 1.5, 18)
    pl3.position.set(0, -4, 3)
    scene.add(pl3)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let frameId: number
    const BOUNDS = { x: 10, y: 7 }

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      cubes.forEach(c => {
        if (c.isDragging) return

        // Spin
        c.mesh.rotation.x += c.rotVel.x
        c.mesh.rotation.y += c.rotVel.y
        c.mesh.rotation.z += c.rotVel.z

        // Drift + float
        c.mesh.position.x += c.vel.x
        c.mesh.position.y += c.vel.y + Math.sin(t * c.floatSpeed + c.floatOffset) * 0.002

        // Slow down over time (friction)
        c.vel.x *= 0.98
        c.vel.y *= 0.98

        // Wrap around edges
        if (c.mesh.position.x > BOUNDS.x) c.mesh.position.x = -BOUNDS.x
        if (c.mesh.position.x < -BOUNDS.x) c.mesh.position.x = BOUNDS.x
        if (c.mesh.position.y > BOUNDS.y) c.mesh.position.y = -BOUNDS.y
        if (c.mesh.position.y < -BOUNDS.y) c.mesh.position.y = BOUNDS.y
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      zIndex: 0,
    }} />
  )
}