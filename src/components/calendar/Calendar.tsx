import React from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import { motion } from 'framer-motion'
import { useCalendar } from '@/contexts/CalendarContext'

interface CalendarProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
}

export const Calendar: React.FC<CalendarProps> = ({ currentDate, onDateSelect }) => {
  const { events } = useCalendar()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day)
          return (
            <motion.button
              key={day.toString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square rounded-md text-center ${
                isSameMonth(day, currentDate)
                  ? 'bg-background hover:bg-accent'
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => onDateSelect(day)}
            >
              {format(day, 'd')}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
} 