import * as React from 'react'

import { cn } from '~/lib/cn'

type BsCalendarProps = {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export const BsCalendar: React.FC<BsCalendarProps> = ({
  value = new Date(),
  onChange,
  className,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(value)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1
    if (day < 1 || day > daysInMonth) return null
    return day
  })

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const handleSelect = (day: number) => {
    const newDate = new Date(year, month, day)
    onChange?.(newDate)
  }

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  return (
    <div
      className={cn(
        'p-4 bg-bg-fill rounded-lg border border-border',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded hover:bg-bg-fill-secondary text-text"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="font-medium text-text">
          {year}年 {month + 1}月
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded hover:bg-bg-fill-secondary text-text"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-text-secondary py-1"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected =
            day === value.getDate() &&
            year === value.getFullYear() &&
            month === value.getMonth()
          return (
            <button
              key={index}
              type="button"
              disabled={day === null}
              onClick={() => day && handleSelect(day)}
              className={cn(
                'aspect-square flex items-center justify-center text-sm rounded',
                day === null && 'invisible',
                isSelected
                  ? 'bg-text text-bg-fill'
                  : 'hover:bg-bg-fill-secondary text-text',
                !isSelected && day && 'cursor-pointer',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
