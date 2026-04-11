import * as React from 'react'

import { Canvas } from './components/Canvas'
import { ComponentPanel } from './components/ComponentPanel'
import { DeviceToolbar } from './components/DeviceToolbar'
import { PropsPanel } from './components/PropsPanel'

export const VisualEditor: React.FC = () => {
  return (
    <div className="flex h-screen bg-bg">
      {/* 左侧组件面板 */}
      <ComponentPanel />

      {/* 中间画布区 */}
      <div className="flex-1 relative">
        <DeviceToolbar />
        <Canvas />
      </div>

      {/* 右侧属性面板 */}
      <PropsPanel />
    </div>
  )
}
