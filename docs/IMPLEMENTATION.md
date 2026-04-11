# 可视化编辑器实现文档

本文档记录了可视化编辑器从骨架到核心功能的实现过程。

## 实现步骤

### 第一步：三栏式编辑器骨架搭建

#### 目标
实现左侧组件库面板、中间画布区、右侧属性面板的基础三栏布局。

#### 实现内容

1. **布局结构**
   - 使用 Tailwind flex 布局实现三栏自适应
   - 左右面板固定宽度 `w-64`
   - 中间画布区使用 `flex-1` 占满剩余空间
   - 使用 Pastel 颜色系统保持风格一致

2. **状态原子定义** ([src/atoms/editor.ts](../src/atoms/editor.ts))
   - `canvasElementsAtom`: 存储画布所有元素列表
   - `selectedElementIdAtom`: 当前选中元素 ID
   - `selectedElementAtom`: 派生原子，根据 ID 获取选中元素
   - `editorConfigAtom`: 编辑器配置（缩放比例、设备尺寸）

   使用 Jotai 的 `createAtomHooks` 创建了完整的读写钩子，遵循项目的 Jotai 模式。

3. **文件结构**
   ```
   src/
   ├── atoms/
   │   └── editor.ts          # 编辑器核心状态
   └── modules/
       └── editor/
           ├── Editor.tsx     # 主编辑器组件
           ├── components/
           │   ├── ComponentPanel.tsx  # 左侧组件面板
           │   ├── Canvas.tsx          # 中间画布
           │   └── PropsPanel.tsx      # 右侧属性面板
           ├── components/             # 基础组件
           │   ├── Text.tsx
           │   ├── Button.tsx
           │   └── Input.tsx
           └── registry.ts             # 组件注册表
   ```

### 第二步：左侧组件库 + 拖拽实现

#### 目标
让用户能从左侧拖拽组件到画布，自动生成可编辑元素。

#### 实现内容

1. **组件注册表** ([registry.ts](../src/modules/editor/registry.ts))
   - 定义 `ComponentMeta` 类型，包含 ID、名称、分类、默认属性、组件
   - 目前注册了三个基础组件：文本、按钮、输入框
   - 分类分为「基础」和「表单」

2. **分类与搜索** ([ComponentPanel.tsx](../src/modules/editor/components/ComponentPanel.tsx))
   - 使用 `reduce` 将组件按分类分组
   - 搜索框支持按组件名称/ID 实时过滤
   - 支持分类折叠/展开，提升空间利用率

3. **拖拽实现**
   - 使用 HTML5 原生拖拽 API
   - 拖拽源设置 `dataTransfer` 传递组件 ID
   - 支持拖拽样式反馈，hover 效果

### 第三步：中间画布 + 元素编辑

#### 目标
实现元素拖拽、选中高亮、缩放、多端适配。

#### 实现内容

1. **多端尺寸切换** ([Canvas.tsx](../src/modules/editor/components/Canvas.tsx))
   - 支持移动端 (375x667)、平板 (768x1024)、桌面端 (1440x1024)
   - 通过切换 CSS 类名实现尺寸变化
   - 支持缩放功能，通过 `transform: scale()` 实现

2. **元素渲染与拖拽移动**
   - 使用 Framer Motion 的 `m.div` 实现拖拽
   - 关闭惯性 (`dragMomentum={false}`) 实现精准拖拽
   - 拖拽结束后更新元素位置到状态
   - 选中元素自动添加高亮边框

3. **放置处理**
   - 画布监听 `drop` 事件，获取拖拽的组件 ID
   - 从注册表查找组件，生成新元素添加到画布
   - 使用 `nanoid` 生成唯一 ID

### 第四步：右侧属性面板 + 实时修改

#### 目标
选中元素后，实时修改样式/属性，画布同步更新。

#### 实现内容

1. **属性编辑** ([PropsPanel.tsx](../src/modules/editor/components/PropsPanel.tsx))
   - 使用 Accordion 组件对属性分类展示：内容、基础样式、布局
   - 根据组件类型动态显示对应属性
     - 文本组件显示「文本内容」
     - 按钮组件显示「按钮文字」
     - 输入框显示「占位符」
   - 支持文字内容、字体颜色、背景颜色、内边距、圆角等属性修改
   - 所有修改实时同步到画布

2. **样式处理**
   - 属性存储为对象，合并后通过内联样式应用到组件
   - 保持结构简单，易于扩展

## 文件结构说明

```
src/
├── atoms/
│   └── editor.ts                    # 编辑器核心状态原子
├── modules/
│   └── editor/
│       ├── Editor.tsx              # 主编辑器三栏布局
│       ├── registry.ts             # 可拖拽组件注册表
│       ├── components/
│       │   ├── ComponentPanel.tsx  # 左侧组件库面板
│       │   ├── Canvas.tsx          # 中间画布区域
│       │   └── PropsPanel.tsx      # 右侧属性面板
│       └── components/             # 基础组件实现
│           ├── Text.tsx            # 文本组件
│           ├── Button.tsx          # 按钮组件
│           └── Input.tsx           # 输入框组件
└── pages/(main)/
    └── editor.sync.tsx             # 编辑器页面路由
```

## 技术要点

1. **状态管理**
   - 使用 Jotai 原子状态，每个原子提供完整的 hooks
   - 派生原子自动处理选中元素计算
   - 遵循项目约定，不直接导出原子

2. **动画**
   - 使用 `m.*` 组件（来自 motion/react）
   - 遵循项目规则不直接使用 `motion.*`
   - Framer Motion 拖拽比原生 API 体验更好

3. **拖拽**
   - 使用 HTML5 原生拖拽 API 实现组件拖入
   - 使用 Framer Motion 实现画布内元素拖拽
   - 混合方案兼顾简洁和体验

4. **样式**
   - 全程使用 Pastel 颜色系统语义化类名
   - 不使用原生 Tailwind 颜色
   - 遵循项目样式规范

5. **路由**
   - 新建 `src/pages/(main)/editor.sync.tsx` 通过文件路由自动生成
   - 不修改自动生成的 `src/generated-routes.ts`

## 后续扩展方向

1. **辅助线与吸附** - 拖拽元素时计算对齐线，自动吸附
2. **层级管理** - 添加图层列表，支持调整元素 z-index
3. **更多组件** - 扩展组件库，添加图片、容器、标题等组件
4. **撤销/重做** - 基于历史记录实现操作回退
5. **导出代码** - 将画布配置导出为 React 组件代码
6. **本地存储** - 保存项目到 localStorage

## 运行测试

```bash
# 开发模式
pnpm dev

# 构建测试
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 构建验证

- 已通过 `pnpm build` 构建测试
- 所有 TypeScript 类型检查通过
- 新增代码符合项目代码规范
