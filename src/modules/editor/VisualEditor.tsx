import * as React from 'react'
import { useEffect } from 'react'

import { useSetToolMode } from '~/atoms/editor'

import { Canvas } from './components/Canvas'
import { DeviceToolbar } from './components/DeviceToolbar'
import { LeftPanel } from './components/LeftPanel'
import { PropsPanel } from './components/PropsPanel'

export const VisualEditor: React.FC = () => {
  const setToolMode = useSetToolMode()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略输入法、ALT/CTRL/META 等组合键
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return

      switch (e.key.toLowerCase()) {
        case 'v': {
          setToolMode('select')
          break
        }
        case 'h': {
          setToolMode('pan')
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setToolMode])

  return (
    <div className="relative w-full h-screen bg-bg overflow-hidden">
      {/* 画布占满整个屏幕，放在最底层 */}
      <div className="absolute inset-0">
        <DeviceToolbar />
        <Canvas />
      </div>

      {/* 左侧面板 - 图层 / 资源双模块 */}
      <LeftPanel />

      {/* 右侧属性面板 - 浮动在画布上方 */}
      <PropsPanel />
    </div>
  )
}
