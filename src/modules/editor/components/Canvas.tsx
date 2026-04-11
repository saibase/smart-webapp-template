import { m } from 'motion/react'
import { nanoid } from 'nanoid'
import * as React from 'react'
import { useRef } from 'react'

import type { CanvasElement } from '~/atoms/editor'
import {
  addCanvasElement,
  updateElementPosition,
  useCanvasElementsValue,
  useEditorConfigValue,
  useSelectedElementIdValue,
  useSetSelectedElementId,
} from '~/atoms/editor'
import { cn } from '~/lib/cn'
import { Spring } from '~/lib/spring'

import { getComponentById } from '../../editor/registry'

type CanvasProps = {
  className?: string
}

const deviceSizes = {
  mobile: 'w-[375px] h-[667px]',
  tablet: 'w-[768px] h-[1024px]',
  desktop: 'w-[1440px] h-[1024px]',
}

export const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const elements = useCanvasElementsValue()
  const selectedId = useSelectedElementIdValue()
  const setSelectedId = useSetSelectedElementId()
  const { scale, device } = useEditorConfigValue()
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentId = e.dataTransfer.getData('componentId')
    if (!componentId) return

    const component = getComponentById(componentId)
    if (!component) return

    // Calculate position relative to canvas
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = Math.round((e.clientX - rect.left) / (scale / 100))
      const y = Math.round((e.clientY - rect.top) / (scale / 100))

      const newElement: CanvasElement = {
        id: nanoid(),
        type: componentId,
        props: { ...component.defaultProps },
        position: { x, y },
        zIndex: elements.length,
      }

      addCanvasElement(newElement)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleCanvasClick = () => {
    setSelectedId(null)
  }

  const handleElementDragEnd = (
    id: string,
    info: { point: { x: number; y: number } },
  ) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const scaledX = (info.point.x - rect.left) / (scale / 100)
    const scaledY = (info.point.y - rect.top) / (scale / 100)

    updateElementPosition(id, { x: scaledX, y: scaledY })
  }

  const renderElement = (element: CanvasElement) => {
    const componentMeta = getComponentById(element.type)
    if (!componentMeta) return null

    const Component = componentMeta.component
    const isSelected = selectedId === element.id

    return (
      <m.div
        key={element.id}
        drag
        dragMomentum={false}
        onDragEnd={(_, info) => handleElementDragEnd(element.id, info)}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedId(element.id)
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={Spring.presets.smooth}
        style={{
          position: 'absolute',
          left: element.position.x,
          top: element.position.y,
          zIndex: element.zIndex,
          boxShadow: isSelected ? '0 0 0 2px #3b82f6' : 'none',
        }}
        className="outline-none"
      >
        <Component {...element.props} />
      </m.div>
    )
  }

  const deviceClass = deviceSizes[device]

  return (
    <main
      className={cn(
        'flex-1 overflow-auto flex justify-center items-center bg-bg',
        className,
      )}
      onClick={handleCanvasClick}
    >
      <div
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          'border transition-all duration-200 relative overflow-hidden',
          deviceClass,
        )}
        style={{
          transform: `scale(${scale / 100})`,
          transformOrigin: 'center center',
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundColor: '#ffffff',
        }}
      >
        {/* 圆点背景层 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundColor: '#ffffff',
          }}
        />
        {/* 内容层 */}
        <div className="relative z-10 w-full h-full">
          {elements.map((element) => renderElement(element))}
          {elements.length === 0 && (
            <div className="flex items-center justify-center h-full text-text-secondary">
              <p>从左侧拖拽组件到这里开始编辑</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
