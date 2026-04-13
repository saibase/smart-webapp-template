import * as React from 'react'

import { cn } from '~/lib/cn'

type BsCountdownProps = {
  targetTime?: number
  text?: string
  onFinish?: () => void
  className?: string
}

export const BsCountdown: React.FC<BsCountdownProps> = ({
  targetTime = Date.now() + 3600 * 1000,
  text = '活动结束',
  onFinish,
  className,
}) => {
  const [timeLeft, setTimeLeft] = React.useState(() => targetTime - Date.now())

  React.useEffect(() => {
    if (timeLeft <= 0) {
      onFinish?.()
      return
    }
    const timer = setInterval(() => {
      const remaining = targetTime - Date.now()
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
        onFinish?.()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [targetTime, onFinish])

  const formatTime = (time: number) => {
    if (time <= 0)
      return { days: '00', hours: '00', minutes: '00', seconds: '00' }
    const days = Math.floor(time / (1000 * 60 * 60 * 24))
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)
    return {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    }
  }

  const { days, hours, minutes, seconds } = formatTime(timeLeft)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {timeLeft > 0 && (
        <>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center bg-text text-bg-fill rounded text-sm font-bold">
              {days}
            </div>
            <span className="text-text">:</span>
            <div className="w-8 h-8 flex items-center justify-center bg-text text-bg-fill rounded text-sm font-bold">
              {hours}
            </div>
            <span className="text-text">:</span>
            <div className="w-8 h-8 flex items-center justify-center bg-text text-bg-fill rounded text-sm font-bold">
              {minutes}
            </div>
            <span className="text-text">:</span>
            <div className="w-8 h-8 flex items-center justify-center bg-text text-bg-fill rounded text-sm font-bold">
              {seconds}
            </div>
          </div>
        </>
      )}
      {timeLeft <= 0 && <span className="text-text">{text}</span>}
    </div>
  )
}
