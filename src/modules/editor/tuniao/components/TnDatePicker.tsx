import * as React from 'react'
import { useState } from 'react'

import { cn } from '~/lib/cn'

export type TnDatePickerProps = {
  modelValue?: Date
  placeholder?: string
  onChange?: (date: Date) => void
  className?: string
}

export const TnDatePicker: React.FC<TnDatePickerProps> = ({
  modelValue,
  placeholder = '请选择日期',
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(modelValue)

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    onChange?.(date)
    setIsOpen(false)
  }

  const formatDate = (date?: Date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className={cn('relative', className)}>
      <input
        type="text"
        readOnly
        value={formatDate(selectedDate)}
        placeholder={placeholder}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-border rounded-md bg-bg-fill focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
      />
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-20 w-72 bg-bg-fill rounded-lg shadow-lg border border-border p-2">
            <div className="text-center font-medium py-2">
              {currentYear}年{currentMonth + 1}月
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
                <div key={d} className="py-1 text-text-secondary font-medium">
                  {d}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const date = new Date(
                  currentYear,
                  currentMonth,
                  i - (today.getDay() - 1),
                )
                const isCurrentMonth = date.getMonth() === currentMonth
                const isToday =
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear()
                const isSelected =
                  selectedDate &&
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear()

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDateChange(date)}
                    className={cn(
                      'py-1 rounded',
                      !isCurrentMonth && 'text-text-secondary opacity-40',
                      isToday && 'bg-accent',
                      isSelected && 'bg-primary text-white',
                    )}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
