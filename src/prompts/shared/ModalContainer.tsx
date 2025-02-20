import React, { useState, useEffect, useRef } from 'react'

interface ModalContainerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  loading?: boolean
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  loading = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Draggable state
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Resizable state
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [resizing, setResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 800,
    height: 600
  })

  // Draggable effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        })
      }
    }
    const handleMouseUp = () => setDragging(false)
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, offset])

  // Resizable effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) {
        const newWidth = Math.max(
          300,
          resizeStart.width + (e.clientX - resizeStart.x)
        )
        const newHeight = Math.max(
          200,
          resizeStart.height + (e.clientY - resizeStart.y)
        )
        setSize({ width: newWidth, height: newHeight })
      }
    }
    const handleMouseUp = () => setResizing(false)
    if (resizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizing, resizeStart])

  if (!isOpen) return null

  return (
    // Outer container allows interactions with underlying elements
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        ref={modalRef}
        className="bg-amber-50 border border-amber-600 rounded-2xl shadow-2xl overflow-y-auto absolute pointer-events-auto"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: `${size.width}px`,
          height: `${size.height}px`
        }}
      >
        {/* Draggable header */}
        <div
          className="cursor-move bg-amber-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center"
          onMouseDown={(e) => {
            setDragging(true)
            const rect = modalRef.current?.getBoundingClientRect()
            if (rect) {
              setOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              })
            }
          }}
        >
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-white text-lg font-bold hover:text-gray-300 transition-all"
          >
            ✕
          </button>
        </div>
        {/* Modal content */}
        <form onSubmit={onSubmit} className="p-4 h-full flex flex-col">
          <div className="flex-1 overflow-auto">{children}</div>
          <div className="flex justify-end mt-4 gap-4">
            <button
              type="button"
              className="px-6 py-3 text-lg font-semibold text-gray-800 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-md transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
        {/* Resize handle at bottom right */}
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-gray-300"
          onMouseDown={(e) => {
            e.stopPropagation()
            setResizing(true)
            setResizeStart({
              x: e.clientX,
              y: e.clientY,
              width: size.width,
              height: size.height
            })
          }}
        ></div>
      </div>
    </div>
  )
}

export default ModalContainer
