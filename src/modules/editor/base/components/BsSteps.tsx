import * as React from 'react'

import { cn } from '~/lib/cn'

export type StepItem = {
  title: string
  description?: string
  status: 'wait' | 'process' | 'finish' | 'error'
}

export type BsStepsProps = {
  steps: StepItem[]
  active?: number
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export const BsSteps: React.FC<BsStepsProps> = ({
  steps = [
    { title: '步骤一', status: 'process' },
    { title: '步骤二', status: 'wait' },
    { title: '步骤三', status: 'wait' },
  ],
  active = 0,
  direction = 'horizontal',
  className,
}) => {
  const isHorizontal = direction === 'horizontal'

  return (
    <div
      className={cn(
        isHorizontal
          ? 'flex items-center space-x-4'
          : 'flex flex-col space-y-4',
        className,
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === active
        const isDone = step.status === 'finish' || index < active

        let lineClass = 'bg-gray-200'
        let dotClass = 'bg-gray-200 text-gray-500'
        let textClass = 'text-text-secondary'

        if (isActive || step.status === 'process') {
          lineClass = 'bg-primary'
          dotClass = 'bg-primary text-white'
          textClass = 'text-text font-medium'
        } else if (isDone || step.status === 'finish') {
          lineClass = 'bg-primary'
          dotClass = 'bg-primary text-white'
          textClass = 'text-text'
        } else if (step.status === 'error') {
          dotClass = 'bg-red-500 text-white'
          textClass = 'text-red-500'
        }

        return (
          <React.Fragment key={index}>
            <div className={cn('flex items-center', !isHorizontal && 'flex-1')}>
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors',
                  dotClass,
                )}
              >
                {isDone ? '✓' : index + 1}
              </div>
              <div className="ml-3">
                <div className={textClass}>{step.title}</div>
                {step.description && (
                  <div className="text-sm text-text-secondary mt-0.5">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'transition-colors',
                  isHorizontal
                    ? 'flex-1 h-1 rounded-full'
                    : 'w-px min-h-8 ml-4',
                  lineClass,
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
