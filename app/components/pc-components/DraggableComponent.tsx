'use client'
import { useRef, useState, useEffect, ReactNode } from 'react'

interface DraggableComponentProps {
  id: string
  slotStyle: React.CSSProperties   // where it lives in the case
  onRemove: (id: string) => void
  removed: boolean
  children: ReactNode
  label: string
}

export default function DraggableComponent({
  id, slotStyle, onRemove, removed, children, label
}: DraggableComponentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const startRef = useRef({ mx: 0, my: 0, ex: 0, ey: 0 })
  const removedRef = useRef(false)
  const animFrameRef = useRef(0)

  // Reset position when restarted
  useEffect(() => {
    if (!removed) {
      // Animate back to slot
      const startX = pos.x
      const startY = pos.y
      let t = 0
      const ease = () => {
        t += 0.08
        const factor = 1 - Math.pow(1 - Math.min(t, 1), 3)
        setPos({ x: startX * (1 - factor), y: startY * (1 - factor) })
        if (t < 1) animFrameRef.current = requestAnimationFrame(ease)
      }
      animFrameRef.current = requestAnimationFrame(ease)
      removedRef.current = false
    }
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [removed])

  const onMouseDown = (e: React.MouseEvent) => {
    if (removed) return
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
    startRef.current = {
      mx: e.clientX, my: e.clientY,
      ex: pos.x, ey: pos.y,
    }
  }

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - startRef.current.mx
      const dy = e.clientY - startRef.current.my
      setPos({ x: startRef.current.ex + dx, y: startRef.current.ey + dy })
    }

    const onUp = (e: MouseEvent) => {
      setDragging(false)
      const dx = e.clientX - startRef.current.mx
      const dy = e.clientY - startRef.current.my
      const dist = Math.hypot(dx, dy)
      // If dragged more than 120px, consider it removed
      if (dist > 120 && !removedRef.current) {
        removedRef.current = true
        onRemove(id)
      } else if (dist <= 120) {
        // Snap back with spring
        setPos({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  const dragDist = Math.hypot(pos.x, pos.y)
  const isBeingPulled = dragging && dragDist > 20

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...slotStyle,
        position: 'absolute',
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        cursor: removed ? 'default' : dragging ? 'grabbing' : 'grab',
        opacity: removed ? 0 : 1,
        transition: dragging ? 'none' : 'opacity 0.3s',
        zIndex: dragging ? 100 : hovered ? 10 : 1,
        userSelect: 'none',
        filter: isBeingPulled
          ? `drop-shadow(0 0 12px rgba(74,155,127,0.8)) drop-shadow(0 0 25px rgba(74,155,127,0.4))`
          : hovered
          ? `drop-shadow(0 0 6px rgba(74,155,127,0.4))`
          : 'none',
      }}
    >
      {/* Tooltip on hover */}
      {hovered && !dragging && !removed && (
        <div style={{
          position: 'absolute', top: -32, left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(20,18,20,0.95)',
          border: '1px solid rgba(74,155,127,0.4)',
          borderRadius: 6, padding: '4px 10px',
          fontSize: '0.7rem', color: '#9DB89A',
          whiteSpace: 'nowrap', zIndex: 200,
          pointerEvents: 'none',
        }}>
          🖱 Drag to remove {label}
        </div>
      )}
      {children}
    </div>
  )
}
