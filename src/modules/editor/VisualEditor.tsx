import * as React from 'react'
import { useEffect } from 'react'

import {
  changeSelectedElementsZIndex,
  flipSelectedElements,
  groupSelectedElements,
  toggleSelectedElementsLock,
  toggleSelectedElementsVisibility,
  ungroupElements,
  useSelectedElementsValue,
  useSetToolMode,
} from '~/atoms/editor'

import { Canvas } from './components/Canvas'
import { LeftPanel } from './components/LeftPanel'
import { PropsPanel } from './components/PropsPanel'
import { TopBar } from './components/TopBar'

export const VisualEditor: React.FC = () => {
  const setToolMode = useSetToolMode()
  const selectedElements = useSelectedElementsValue()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 跳过输入框
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return

      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const mod = isMac ? e.metaKey : e.ctrlKey

      // ── 工具模式切换（无修饰键）──────────────
      if (!mod && !e.shiftKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'v': {
            setToolMode('select')
            return
          }
          case 'h': {
            setToolMode('pan')
            return
          }
          // 层级快捷键（无修饰）
          case ']': {
            changeSelectedElementsZIndex('top')
            e.preventDefault()
            return
          }
          case '[': {
            changeSelectedElementsZIndex('bottom')
            e.preventDefault()
            return
          }
        }
      }

      // ── Shift + 单键 ─────────────────────────
      if (e.shiftKey && !mod && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'h': {
            flipSelectedElements('horizontal')
            e.preventDefault()
            return
          }
          case 'v': {
            flipSelectedElements('vertical')
            e.preventDefault()
            return
          }
        }
      }

      // ── Mod（Cmd/Ctrl）+ 单键 ────────────────
      if (mod && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case ']': {
            changeSelectedElementsZIndex('up')
            e.preventDefault()
            return
          }
          case '[': {
            changeSelectedElementsZIndex('down')
            e.preventDefault()
            return
          }
          case 'g':
          case 'G': {
            groupSelectedElements()
            e.preventDefault()
            return
          }
        }
      }

      // ── Shift + Mod ──────────────────────────
      if (e.shiftKey && mod && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'g': {
            // 取消编组：选中的第一个 group 元素
            const group = selectedElements.find((el) => el.type === 'group')
            if (group) ungroupElements(group.id)
            e.preventDefault()
            return
          }
          case 'h': {
            toggleSelectedElementsVisibility()
            e.preventDefault()
            return
          }
          case 'l': {
            toggleSelectedElementsLock()
            e.preventDefault()
            return
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setToolMode, selectedElements])

  return (
    <div className="relative w-full h-screen bg-bg overflow-hidden">
      {/* 顶部操作栏（h-11 = 44px，z-[70]）*/}
      <TopBar />

      {/* 画布（顶部留出 84px 给 TopBar 双行）*/}
      <div className="absolute inset-0 pt-[84px]">
        <Canvas />
      </div>

      {/* 左侧面板（top-[84px] 紧贴 TopBar 下方）*/}
      <LeftPanel />

      {/* 右侧属性面板 */}
      <PropsPanel />
    </div>
  )
}
